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
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */
@Entity
@Table(name = "parameters_performed", catalog = "phenodcc_overviews", schema = "")
@XmlRootElement
public class ParametersPerformed implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "parameters_performed_id", nullable = false)
    private Long parametersPerformedId;
    @Basic(optional = false)
    @Column(name = "genotype_id", nullable = false)
    private int genotypeId;
    @Column(name = "parameter_id", length = 45)
    private String parameterId;
    @Basic(optional = false)
    @Column(nullable = false)
    private boolean sex;
    private Boolean zygosity;

    public ParametersPerformed() {
    }

    public ParametersPerformed(Long parametersPerformedId) {
        this.parametersPerformedId = parametersPerformedId;
    }

    public ParametersPerformed(Long parametersPerformedId, int genotypeId, boolean sex) {
        this.parametersPerformedId = parametersPerformedId;
        this.genotypeId = genotypeId;
        this.sex = sex;
    }

    public Long getParametersPerformedId() {
        return parametersPerformedId;
    }

    public void setParametersPerformedId(Long parametersPerformedId) {
        this.parametersPerformedId = parametersPerformedId;
    }

    public int getGenotypeId() {
        return genotypeId;
    }

    public void setGenotypeId(int genotypeId) {
        this.genotypeId = genotypeId;
    }

    public String getParameterId() {
        return parameterId;
    }

    public void setParameterId(String parameterId) {
        this.parameterId = parameterId;
    }

    public boolean getSex() {
        return sex;
    }

    public void setSex(boolean sex) {
        this.sex = sex;
    }

    public Boolean getZygosity() {
        return zygosity;
    }

    public void setZygosity(Boolean zygosity) {
        this.zygosity = zygosity;
    }
}
