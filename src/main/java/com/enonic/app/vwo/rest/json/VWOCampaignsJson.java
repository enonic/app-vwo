package com.enonic.app.vwo.rest.json;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import static com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY;

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

@JsonIgnoreProperties(ignoreUnknown = true)
class VWOCampaignJson
{
    private Integer id;

    private String name;

    private String type;

    @com.fasterxml.jackson.annotation.JsonProperty(access = WRITE_ONLY)
    private String platform;

    private String status;

    @com.fasterxml.jackson.annotation.JsonProperty(access = WRITE_ONLY)
    private Long createdOn;

    private boolean deleted;

    @com.fasterxml.jackson.annotation.JsonProperty(access = WRITE_ONLY)
    private CreatedBy createdBy;

    private String primaryUrl;

    @com.fasterxml.jackson.annotation.JsonProperty(access = WRITE_ONLY)
    private List<Url> urls;

    @com.fasterxml.jackson.annotation.JsonProperty(access = WRITE_ONLY)
    private List<String> labels;

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

    public String getType()
    {
        return type;
    }

    public void setType( final String type )
    {
        this.type = type;
    }

    public String getPlatform()
    {
        return platform;
    }

    public void setPlatform( final String platform )
    {
        this.platform = platform;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus( final String status )
    {
        this.status = status;
    }

    public Long getCreatedOn()
    {
        return createdOn;
    }

    public void setCreatedOn( final Long createdOn )
    {
        this.createdOn = createdOn;
    }

    public boolean getDeleted()
    {
        return deleted;
    }

    public void setIsDeleted( final boolean isDeleted )
    {
        this.deleted = isDeleted;
    }

    public CreatedBy getCreatedBy()
    {
        return createdBy;
    }

    public void setCreatedBy( final CreatedBy createdBy )
    {
        this.createdBy = createdBy;
    }

    public String getPrimaryUrl()
    {
        return primaryUrl;
    }

    public void setPrimaryUrl( final String primaryUrl )
    {
        this.primaryUrl = primaryUrl;
    }

    public List<Url> getUrls()
    {
        return urls;
    }

    public void setUrls( final List<Url> urls )
    {
        this.urls = urls;
    }

    public List<String> getLabels()
    {
        return labels;
    }

    public void setLabels( final List<String> labels )
    {
        this.labels = labels;
    }
}

class CreatedBy {
    private String id;
    private String name;
    private String imageUrl;

    public String getId()
    {
        return id;
    }

    public void setId( final String id )
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

    public String getImageUrl()
    {
        return imageUrl;
    }

    public void setImageUrl( final String imageUrl )
    {
        this.imageUrl = imageUrl;
    }
}

class Url {
    private String type;
    private String value;

    public String getType()
    {
        return type;
    }

    public void setType( final String type )
    {
        this.type = type;
    }

    public String getValue()
    {
        return value;
    }

    public void setValue( final String value )
    {
        this.value = value;
    }
}