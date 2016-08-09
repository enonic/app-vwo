package com.enonic.app.vwo.rest;

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

import com.enonic.app.vwo.rest.json.ListCampaignsResponseJson;
import com.enonic.app.vwo.rest.json.VWOServiceGeneralRequestJson;
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
    public ListCampaignsResponseJson listCampaigns( final VWOServiceGeneralRequestJson json )
        throws IOException
    {
        CloseableHttpResponse response = null;
        try
        {
            response = HttpClients.createDefault().execute( makeListCampaignsVWOApiRequest( json ) );
            System.out.println( response.getStatusLine() );

            if ( response.getStatusLine().getStatusCode() == 200 )
            {
                return new ListCampaignsResponseJson( parseVWOCampaignsHttpResponse( response ).getCampaigns() );
            }
            return null;
        }
        finally
        {
            response.close();
        }
    }

    private VWOCampaignsJson parseVWOCampaignsHttpResponse( final CloseableHttpResponse response ) throws IOException {
        final HttpEntity entity = response.getEntity();
        final VWOCampaignsJson vwoCampaigns = new ObjectMapper().readValue( response.getEntity().getContent(), VWOCampaignsJson.class );
        EntityUtils.consume( entity );
        return vwoCampaigns;
    }

    private HttpGet makeListCampaignsVWOApiRequest( final VWOServiceGeneralRequestJson json ) {
        final HttpGet httpGet = new HttpGet( "http://app.vwo.com/api/v2/accounts/" + json.getAccountId() + "/campaigns" );
        httpGet.addHeader( "token", json.getTokenId() );
        return httpGet;
    }
}
