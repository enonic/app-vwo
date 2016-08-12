package com.enonic.app.vwo.rest.json;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VWOCampaignDetailsJson extends VWOCampaignJson
{

    private VWOCampaignDetails campaign;

    public VWOCampaignDetails getCampaign()
    {
        return campaign;
    }

    @JsonProperty("_data")
    public void setCampaign( final VWOCampaignDetails campaign )
    {
        this.campaign = campaign;
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class VWOCampaignDetails extends VWOCampaignJson
{

    private Float percentTraffic;
    private List<Goal> goals;
    private List<Variation> variations;

    public Float getPercentTraffic()
    {
        return percentTraffic;
    }

    public void setPercentTraffic( final Float percentTraffic )
    {
        this.percentTraffic = percentTraffic;
    }

    public List<Goal> getGoals()
    {
        return goals;
    }

    public void setGoals( final List<Goal> goals )
    {
        this.goals = goals;
    }

    public List<Variation> getVariations()
    {
        return variations;
    }

    public void setVariations( final List<Variation> variations )
    {
        this.variations = variations;
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class Variation {
    private Integer id;
    private String name;
    private boolean isControl;
    private boolean isDisabled;

    public Integer getId()
    {
        return id;
    }

    public void setId( final Integer id )
    {
        this.id = id;
    }

    public String getName()
    {
        return name;
    }

    public void setName( final String name )
    {
        this.name = name;
    }

    public boolean isControl()
    {
        return isControl;
    }

    public void setIsControl( final boolean isControl )
    {
        this.isControl = isControl;
    }

    public boolean isDisabled()
    {
        return isDisabled;
    }

    public void setIsDisabled( final boolean isDisabled )
    {
        this.isDisabled = isDisabled;
    }
}


@JsonIgnoreProperties(ignoreUnknown = true)
class Goal {

    private Integer id;
    private boolean isPrimary;
    private String name;

    public Integer getId()
    {
        return id;
    }

    public void setId( final Integer id )
    {
        this.id = id;
    }

    public boolean isPrimary()
    {
        return isPrimary;
    }

    public void setIsPrimary( final boolean isPrimary )
    {
        this.isPrimary = isPrimary;
    }

    public String getName()
    {
        return name;
    }

    public void setName( final String name )
    {
        this.name = name;
    }
}