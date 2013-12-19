/*
 * Copyright 2013 Medical Research Council Harwell.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.mousephenotype.dcc.heatmap.entities;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlElement;

/**
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */
public class Details implements Serializable, Comparable<Details> {

    private String procedureName;
    private String parameterName;
    private String parameterKey;
    private String mpId;
    private String mpTerm;
    private int selectionOutcome;
    private Double pValue;

    public Details() {
    }

    public Details(String parameterKey, String parameterName,
            Double pValue, String mpId) {
        this.parameterKey = parameterKey;
        this.parameterName = parameterName;
        this.pValue = pValue;
        this.mpId = mpId;
    }

    @XmlElement(name = "a")
    public String getProcedureName() {
        return procedureName;
    }

    public void setProcedureName(String procedureName) {
        this.procedureName = procedureName;
    }

    
    @XmlElement(name = "k")
    public String getParameterKey() {
        return parameterKey;
    }

    public void setParameterKey(String parameterKey) {
        this.parameterKey = parameterKey;
    }

    @XmlElement(name = "n")
    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    @XmlElement(name = "m")
    public String getMpId() {
        return mpId;
    }

    public void setMpId(String mpId) {
        this.mpId = mpId;
    }

    @XmlElement(name = "t")
    public String getMpTerm() {
        return mpTerm;
    }

    public void setMpTerm(String term) {
        this.mpTerm = term.substring(0, 1).toUpperCase() + term.substring(1);
    }

    @XmlElement(name = "p")
    public Double getpValue() {
        return pValue;
    }

    public void setpValue(Double pValue) {
        this.pValue = pValue;
    }

    @XmlElement(name = "o")
    public int getSelectionOutcome() {
        return selectionOutcome;
    }

    public void setSelectionOutcome(int selectionOutcome) {
        this.selectionOutcome = selectionOutcome;
    }

    @Override
    public int compareTo(Details d) {
        return procedureName.compareTo(d.getProcedureName());
    }
}
