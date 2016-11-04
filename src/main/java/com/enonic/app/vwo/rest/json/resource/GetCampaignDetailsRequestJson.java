package com.enonic.app.vwo.rest.json.resource;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GetCampaignDetailsRequestJson extends VWOServiceGeneralRequestJson
{

    private Integer campaignId;

    @JsonCreator
    public GetCampaignDetailsRequestJson( @JsonProperty("campaignId") final Integer campaignId ) {
        super();
        this.campaignId = campaignId;
    }

    public Integer getCampaignId()
    {
        return campaignId;
    }

    public void setCampaignId( final Integer campaignId )
    {
        this.campaignId = campaignId;
    }
}
