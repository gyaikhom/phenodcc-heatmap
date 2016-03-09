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

/**
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */
public class Significance implements Serializable {

    private String key;
    private Integer genotypeId;
    private SignificanceEntry significance;

    public Significance(Integer procedureType, Integer genotypeId,
            Double pValue, Double homPvalue, Double hetPvalue,
            Double hemPvalue, Double sexPvalue, Double homSexPvalue,
            Double hetSexPvalue, Double hemSexPvalue) {
        this.key = procedureType.toString();
        this.genotypeId = genotypeId;
        this.significance = new SignificanceEntry(
                pValue, homPvalue, hetPvalue, hemPvalue,
                sexPvalue, homSexPvalue, hetSexPvalue, hemSexPvalue);
    }

    public Significance(String parameterKey, Integer genotypeId,
            Double pValue, Double homPvalue, Double hetPvalue,
            Double hemPvalue, Double sexPvalue, Double homSexPvalue,
            Double hetSexPvalue, Double hemSexPvalue) {
        this.key = parameterKey;
        this.genotypeId = genotypeId;
        this.significance = new SignificanceEntry(
                pValue, homPvalue, hetPvalue, hemPvalue,
                sexPvalue, homSexPvalue, hetSexPvalue, hemSexPvalue);
    }

    public SignificanceEntry getSignificance() {
        return significance;
    }

    public void setSignificance(SignificanceEntry significance) {
        this.significance = significance;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Integer getGenotypeId() {
        return genotypeId;
    }

    public void setGenotypeId(Integer genotypeId) {
        this.genotypeId = genotypeId;
    }
}
