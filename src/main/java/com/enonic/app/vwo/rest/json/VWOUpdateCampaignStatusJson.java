package com.enonic.app.vwo.rest.json;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@SuppressWarnings( "unused" )
public class VWOUpdateCampaignStatusJson
{
    private VWOUpdateCampaignStatus result;

    public VWOUpdateCampaignStatus getResult()
    {
        return result;
    }

    @JsonProperty("_data")
    public void setResult( final VWOUpdateCampaignStatus result )
    {
        this.result = result;
    }
}

@SuppressWarnings( "unused" )
@JsonIgnoreProperties(ignoreUnknown = true)
class VWOUpdateCampaignStatus {

    private String status;
    private List<String> ids;

    public String getStatus()
    {
        return status;
    }

    public void setStatus( final String status )
    {
        this.status = status;
    }

    public List<String> getIds()
    {
        return ids;
    }

    public void setIds( final List<String> ids )
    {
        this.ids = ids;
    }
}
