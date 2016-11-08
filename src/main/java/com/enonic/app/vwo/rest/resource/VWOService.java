package com.enonic.app.vwo.rest.resource;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;

import com.google.common.base.Strings;

import com.enonic.app.vwo.rest.json.VWOCampaignDetailsJson;
import com.enonic.app.vwo.rest.json.VWOCampaignsJson;
import com.enonic.app.vwo.rest.json.VWOCreateNewCampaignJson;
import com.enonic.app.vwo.rest.json.VWOErrorResponseJson;
import com.enonic.app.vwo.rest.json.VWOUpdateCampaignStatusJson;
import com.enonic.app.vwo.rest.json.resource.CreateNewCampaignRequestJson;
import com.enonic.app.vwo.rest.json.resource.GetCampaignDetailsRequestJson;
import com.enonic.app.vwo.rest.json.resource.UpdateCampaignStatusRequestJson;
import com.enonic.app.vwo.rest.json.resource.VWOServiceGeneralRequestJson;
import com.enonic.xp.jaxrs.JaxRsComponent;
import com.enonic.xp.security.RoleKeys;

@Path("admin/rest/vwo")
@RolesAllowed(RoleKeys.ADMIN_ID)
@Component(immediate = true, configurationPid = "com.enonic.app.vwo")
@Produces(MediaType.APPLICATION_JSON)
public class VWOService
    implements JaxRsComponent
{

    private static final String VWO_TOKEN_CONFIG_KEY = "vwo.token";

    private static final String VWO__ACCOUNT_ID_CONFIG_KEY = "vwo.accountId";

    private static final String CONFIG_ERROR_MESSAGE = "VWO token and/or accountId not found in the config file";

    private String vwoToken;

    private String accountId;

    @Activate
    public void activate( final Map<String, String> map )
    {
        this.vwoToken = map.get( VWO_TOKEN_CONFIG_KEY );
        if ( this.vwoToken != null )
        {
            this.vwoToken = this.vwoToken.trim();
        }
        this.accountId = map.get( VWO__ACCOUNT_ID_CONFIG_KEY );
        if ( this.accountId != null )
        {
            this.accountId = this.accountId.trim();
        }
    }

    private boolean isConfigOk()
    {
        if ( Strings.isNullOrEmpty( vwoToken ) || Strings.isNullOrEmpty( accountId ) )
        {
            return false;
        }
        return true;
    }

    @POST
    @Path("listCampaigns")
    public Response listCampaigns( final VWOServiceGeneralRequestJson json )
        throws IOException
    {
        return doVWOAPICall( makeListCampaignsVWOApiRequest( json ), VWOCampaignsJson.class );
    }

    @POST
    @Path("getCampaignDetails")
    public Response getCampaignDetails( final GetCampaignDetailsRequestJson json )
        throws IOException
    {
        return doVWOAPICall( makeGetCampaignDetailsVWOApiRequest( json ), VWOCampaignDetailsJson.class );
    }

    @POST
    @Path("updateCampaignStatus")
    public Response updateCampaignStatus( final UpdateCampaignStatusRequestJson json )
        throws IOException
    {
        return doVWOAPICall( makeUpdateCampaignStatusVWOApiRequest( json ), VWOUpdateCampaignStatusJson.class );
    }

    @POST
    @Path("createNewCampaign")
    public Response createNewCampaign( final CreateNewCampaignRequestJson json )
        throws IOException
    {
        return doVWOAPICall( makeCreateNewCampaignVWOApiRequest( json ), VWOCreateNewCampaignJson.class );
    }

    private <T> Response doVWOAPICall( final HttpRequestBase httpRequest, final Class<T> responseJsonClass )
        throws IOException
    {
        if ( !isConfigOk() )
        {
            return Response.status( Response.Status.UNAUTHORIZED ).entity( CONFIG_ERROR_MESSAGE ).build();
        }

        CloseableHttpResponse response = null;
        try
        {
            response = HttpClients.createDefault().execute( httpRequest );

            int statusCode = response.getStatusLine().getStatusCode();

            if ( statusCode == 200 || statusCode == 201 )
            {
                return Response.ok( parseVWOHttpResponse( response, responseJsonClass ) ).build();
            }
            else
            {
                return Response.status( statusCode ).
                    entity( translateBadResponse( response ) ).build();
            }
        }
        finally
        {
            response.close();
        }
    }

    private String translateBadResponse( final CloseableHttpResponse response )
        throws IOException
    {

        if ( response.getStatusLine().getStatusCode() == 400 )
        {
            final HttpEntity entity = response.getEntity();
            final VWOErrorResponseJson json = new ObjectMapper().readValue( response.getEntity().getContent(), VWOErrorResponseJson.class );
            EntityUtils.consume( entity );

            return translateBadStatusCode( response.getStatusLine().getStatusCode() ) +
                ( json.getErrors().size() > 0 ? json.getErrors().get( 0 ).getMessage() : "" );
        }
        else
        {
            return translateBadStatusCode( response.getStatusLine().getStatusCode() );
        }
    }

    private <T> T parseVWOHttpResponse( final CloseableHttpResponse response, final Class<T> clazz )
        throws IOException
    {
        final HttpEntity entity = response.getEntity();
        T result = null;
        try
        {
            result = new ObjectMapper().readValue( entity.getContent(), clazz );
        }
        catch ( final JsonMappingException e )
        {
            try
            {
                return clazz.newInstance();
            }
            catch ( final Exception exc )
            {
            }
        }
        finally
        {
            EntityUtils.consume( entity );
        }
        return result;
    }

    private HttpGet makeListCampaignsVWOApiRequest( final VWOServiceGeneralRequestJson json )
    {
        final HttpGet httpGet = new HttpGet( "http://app.vwo.com/api/v2/accounts/" + accountId + "/campaigns" );
        httpGet.addHeader( "token", vwoToken );
        return httpGet;
    }

    private HttpGet makeGetCampaignDetailsVWOApiRequest( final GetCampaignDetailsRequestJson json )
    {
        final HttpGet httpGet = new HttpGet( "http://app.vwo.com/api/v2/accounts/" + accountId + "/campaigns/" + json.getCampaignId() );
        httpGet.addHeader( "token", vwoToken );
        return httpGet;
    }

    private HttpPatch makeUpdateCampaignStatusVWOApiRequest( final UpdateCampaignStatusRequestJson json )
        throws UnsupportedEncodingException
    {
        final HttpPatch httpPatch = new HttpPatch( "http://app.vwo.com/api/v2/accounts/" + accountId + "/campaigns/status" );
        httpPatch.addHeader( "token", vwoToken );

        StringEntity input = new StringEntity( "{\"ids\":[" + json.getCampaignId() + "],\"status\":\"" + json.getStatus() + "\"}" );
        input.setContentType( "application/json" );
        httpPatch.setEntity( input );

        return httpPatch;
    }

    private HttpPost makeCreateNewCampaignVWOApiRequest( final CreateNewCampaignRequestJson json )
        throws UnsupportedEncodingException
    {
        final HttpPost httpPost = new HttpPost( "http://app.vwo.com/api/v2/accounts/" + accountId + "/campaigns" );
        httpPost.addHeader( "token", vwoToken );

        StringEntity input = new StringEntity( json.getNewCampaignParams() );
        input.setContentType( "application/json" );
        httpPost.setEntity( input );

        return httpPost;
    }

    private String translateBadStatusCode( int code )
    {
        String badMessage = "Something went wrong while executing VWO API call.";
        switch ( code )
        {
            case 400:
                badMessage = "Bad Request. Invalid json was sent. ";
                break;
            case 401:
                badMessage = "Authentication failed. Please check that token and accountId are valid.";
                break;
            case 403:
                badMessage = "Forbidden. You provided invalid or revoked token or don't have read/write access.";
                break;
            case 404:
                badMessage = "Not Found. Id used in the request was inaccurate or you don't have permission to view/edit it.";
                break;
            case 429:
                badMessage = "Too Many Requests. You hit a rate limit for the API.";
                break;
            case 503:
                badMessage = "Service Unavailable. The VWO API is overloaded or down for maintenance.";
            default:
                break;
        }

        return badMessage;
    }
}
