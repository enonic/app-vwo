package com.enonic.app.vwo.rest.json.resource;

public class UpdateCampaignStatusRequestJson extends GetCampaignDetailsRequestJson
{
    private String status;

    public String getStatus()
    {
        return status;
    }

    public void setStatus( final String status )
    {
        this.status = status;
    }
}
