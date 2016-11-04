package com.enonic.app.vwo.rest.json.resource;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateCampaignStatusRequestJson extends GetCampaignDetailsRequestJson
{

    private String status;

    @JsonCreator
    public UpdateCampaignStatusRequestJson( @JsonProperty("campaignId") final Integer campaignId,
                                            @JsonProperty("status") final String status) {
        super(campaignId);
        this.status = status;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus( final String status )
    {
        this.status = status;
    }
}
