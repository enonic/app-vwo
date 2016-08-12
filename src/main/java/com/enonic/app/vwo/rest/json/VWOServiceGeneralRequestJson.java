package com.enonic.app.vwo.rest.json;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class VWOServiceGeneralRequestJson
{
    final private String accountId;

    final private String tokenId;

    @JsonCreator
    public VWOServiceGeneralRequestJson( @JsonProperty("accountId") final String accountId, @JsonProperty("tokenId") final String tokenId ) {

        this.accountId = accountId;
        this.tokenId = tokenId;
    }

    public String getAccountId()
    {
        return accountId;
    }

    public String getTokenId()
    {
        return tokenId;
    }
}
