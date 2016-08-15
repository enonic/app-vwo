package com.enonic.app.vwo.rest.json.resource;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateCampaignStatusRequestJson extends GetCampaignDetailsRequestJson
{

    private String status;

    @JsonCreator
    public UpdateCampaignStatusRequestJson( @JsonProperty("accountId") final String accountId,
                                          @JsonProperty("tokenId") final String tokenId,
                                          @JsonProperty("campaignId") final Integer campaignId,
                                            @JsonProperty("status") final String status) {
        super(accountId, tokenId, campaignId);
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
