package com.enonic.app.vwo.rest.json;

import java.util.List;

public class ListCampaignsResponseJson
{

    private List<VWOCampaignJson> campaigns;

    public ListCampaignsResponseJson( final List<VWOCampaignJson> campaigns )
    {
        this.campaigns = campaigns;
    }

    public List<VWOCampaignJson> getCampaigns()
    {
        return campaigns;
    }
}
