package com.enonic.app.vwo.rest.resource;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.osgi.service.component.annotations.Component;

import com.enonic.app.vwo.rest.json.VWOCampaignDetailsJson;
import com.enonic.app.vwo.rest.json.VWOCampaignsJson;
import com.enonic.app.vwo.rest.json.VWOUpdateCampaignStatusJson;
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
    @POST
    @Path("listCampaigns")
    public VWOCampaignsJson listCampaigns( final VWOServiceGeneralRequestJson json )
        throws IOException
    {
        return doVWOAPICall( makeListCampaignsVWOApiRequest( json ), VWOCampaignsJson.class );
    }

    @POST
    @Path("getCampaignDetails")
    public VWOCampaignDetailsJson getCampaignDetails( final GetCampaignDetailsRequestJson json )
        throws IOException
    {
        return doVWOAPICall( makeGetCampaignDetailsVWOApiRequest( json ), VWOCampaignDetailsJson.class );
    }

    @POST
    @Path("updateCampaignStatus")
    public VWOUpdateCampaignStatusJson updateCampaignStatus( final UpdateCampaignStatusRequestJson json )
        throws IOException
    {
        return doVWOAPICall( makeUpdateCampaignStatusVWOApiRequest( json ), VWOUpdateCampaignStatusJson.class );
    }

    private <T> T doVWOAPICall( final HttpRequestBase httpRequest, final Class<T> clazz) throws IOException {
        CloseableHttpResponse response = null;
        try
        {
            response = HttpClients.createDefault().execute( httpRequest );
            System.out.println( response.getStatusLine() );

            if ( response.getStatusLine().getStatusCode() == 200 )
            {
                return parseVWOHttpResponse( response, clazz );
            }
            return null;
        }
        finally
        {
            response.close();
        }
    }

    private <T> T parseVWOHttpResponse( final CloseableHttpResponse response, final Class<T> clazz) throws IOException {
        final HttpEntity entity = response.getEntity();
        final T result = new ObjectMapper().readValue( response.getEntity().getContent(), clazz );
        EntityUtils.consume( entity );
        return result;
    }

    private HttpGet makeListCampaignsVWOApiRequest( final VWOServiceGeneralRequestJson json ) {
        final HttpGet httpGet = new HttpGet( "http://app.vwo.com/api/v2/accounts/" + json.getAccountId() + "/campaigns" );
        httpGet.addHeader( "token", json.getTokenId() );
        return httpGet;
    }

    private HttpGet makeGetCampaignDetailsVWOApiRequest( final GetCampaignDetailsRequestJson json ) {
        final HttpGet httpGet = new HttpGet( "http://app.vwo.com/api/v2/accounts/" + json.getAccountId() + "/campaigns/" + json.getCampaignId());
        httpGet.addHeader( "token", json.getTokenId() );
        return httpGet;
    }

    private HttpPatch makeUpdateCampaignStatusVWOApiRequest( final UpdateCampaignStatusRequestJson json )
        throws UnsupportedEncodingException
    {
        final HttpPatch httpPatch = new HttpPatch( "http://app.vwo.com/api/v2/accounts/" + json.getAccountId() + "/campaigns/status");
        httpPatch.addHeader( "token", json.getTokenId() );

        StringEntity input = new StringEntity("{\"ids\":[" + json.getCampaignId() + "],\"status\":\"" + json.getStatus() +"\"}");
        input.setContentType( "application/json" );
        httpPatch.setEntity( input );

        return httpPatch;
    }
}
