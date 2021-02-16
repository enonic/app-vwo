package com.enonic.app.vwo.rest.json;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@SuppressWarnings( "unused" )
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
@SuppressWarnings( "unused" )
class VWOCampaignDetails extends VWOCampaignJson
{
    private Float percentTraffic;
    private List<Goal> goals;
    private List<Variation> variations;
    private Thresholds thresholds;

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

    public Thresholds getThresholds()
    {
        return thresholds;
    }

    public void setThresholds( final Thresholds thresholds )
    {
        this.thresholds = thresholds;
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
@SuppressWarnings( "unused" )
class Thresholds
{
    private Integer visitors;

    public Integer getVisitors()
    {
        return visitors;
    }

    public void setVisitors( final Integer visitors )
    {
        this.visitors = visitors;
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
@SuppressWarnings( "unused" )
class Variation {
    private Integer id;
    private String name;
    private boolean isControl;
    private boolean isDisabled;
    private String screenshot;

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

    public String getScreenshot()
    {
        return screenshot;
    }

    @JsonProperty("screenshots")
    public void setScreenshot( Map<String, Object> screenshots )
    {
        this.screenshot = (String) screenshots.get("quick");
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
@SuppressWarnings( "unused" )
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
