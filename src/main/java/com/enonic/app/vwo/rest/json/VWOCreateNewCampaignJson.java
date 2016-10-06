package com.enonic.app.vwo.rest.json;


import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

public class VWOCreateNewCampaignJson
{
    private VWOCreateNewCampaign result;

    public VWOCreateNewCampaign getResult()
    {
        return result;
    }

    @JsonProperty("_data")
    public void setResult( final VWOCreateNewCampaign result )
    {
        this.result = result;
    }
}

@SuppressWarnings( "unused" )
@JsonIgnoreProperties(ignoreUnknown = true)
class VWOCreateNewCampaign {

    private String status;
    private String id;

    public String getStatus()
    {
        return status;
    }

    public void setStatus( final String status )
    {
        this.status = status;
    }

    public String getId()
    {
        return id;
    }

    public void setId( final String id )
    {
        this.id = id;
    }
}

