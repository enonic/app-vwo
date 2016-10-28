package com.enonic.app.vwo.rest.json.resource;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateNewCampaignRequestJson
    extends VWOServiceGeneralRequestJson
{
    private String newCampaignParams;

    @JsonCreator
    public CreateNewCampaignRequestJson( @JsonProperty("newCampaignParams") final String newCampaignParams ) {
        super();
        this.newCampaignParams = newCampaignParams;
    }

    public String getNewCampaignParams()
    {
        return newCampaignParams;
    }
}
