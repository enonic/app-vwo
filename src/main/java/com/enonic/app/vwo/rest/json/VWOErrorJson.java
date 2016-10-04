package com.enonic.app.vwo.rest.json;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VWOErrorJson
{
    private Integer code;

    private String message;

    public Integer getCode()
    {
        return code;
    }

    public void setCode( final Integer code )
    {
        this.code = code;
    }

    public String getMessage()
    {
        return message;
    }

    public void setMessage( final String message )
    {
        this.message = message;
    }
}
