package com.enonic.app.vwo.rest;

import java.util.List;


import org.codehaus.jackson.annotate.JsonProperty;

import com.enonic.app.vwo.rest.json.VWOCampaignJson;

public class VWOCampaignsJson
{

    private List<VWOCampaignJson> campaigns;

    public List<VWOCampaignJson> getCampaigns()
    {
        return campaigns;
    }

    @JsonProperty("_data")
    public void setCampaigns( final List<VWOCampaignJson> campaigns )
    {
        this.campaigns = campaigns;
    }
}
