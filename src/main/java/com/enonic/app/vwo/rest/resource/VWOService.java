package com.enonic.app.vwo.rest.resource;

import java.io.IOException;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.osgi.service.component.annotations.Component;

import com.enonic.app.vwo.rest.json.resource.GetCampaignDetailsRequestJson;
import com.enonic.app.vwo.rest.json.VWOCampaignDetailsJson;
import com.enonic.app.vwo.rest.json.VWOCampaignsJson;
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
        CloseableHttpResponse response = null;
        try
        {
            response = HttpClients.createDefault().execute( makeListCampaignsVWOApiRequest( json ) );
            System.out.println( response.getStatusLine() );

            if ( response.getStatusLine().getStatusCode() == 200 )
            {
                return parseVWOHttpResponse( response, VWOCampaignsJson.class );
            }
            return null;
        }
        finally
        {
            response.close();
        }
    }

    @POST
    @Path("getCampaignDetails")
    public VWOCampaignDetailsJson getCampaignDetails( final GetCampaignDetailsRequestJson json )
        throws IOException
    {
        CloseableHttpResponse response = null;
        try
        {
            response = HttpClients.createDefault().execute( makeGetCampaignDetailsVWOApiRequest( json ) );
            System.out.println( response.getStatusLine() );

            if ( response.getStatusLine().getStatusCode() == 200 )
            {
                return parseVWOHttpResponse( response, VWOCampaignDetailsJson.class );
            }
            return null;
        }
        finally
        {
            response.close();
        }
    }


    private <T> T parseVWOHttpResponse( final CloseableHttpResponse response, Class<T> clazz) throws IOException {
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
}
