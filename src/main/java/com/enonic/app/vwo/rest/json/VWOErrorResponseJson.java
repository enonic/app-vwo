package com.enonic.app.vwo.rest.json;

import java.util.List;

import org.codehaus.jackson.annotate.JsonProperty;

public class VWOErrorResponseJson
{
    private List<VWOErrorJson> errors;

    public List<VWOErrorJson> getErrors()
    {
        return errors;
    }

    @JsonProperty("_errors")
    public void setErrors( final List<VWOErrorJson> errors )
    {
        this.errors = errors;
    }
}