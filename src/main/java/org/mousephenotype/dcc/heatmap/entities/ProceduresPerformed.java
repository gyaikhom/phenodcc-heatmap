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
@Table(name = "procedures_performed", catalog = "phenodcc_overviews", schema = "")
@XmlRootElement
public class ProceduresPerformed implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "procedures_performed_id", nullable = false)
    private Long proceduresPerformedId;
    @Column(length = 255)
    private String name;
    @Basic(optional = false)
    @Column(name = "procedure_type_id", nullable = false)
    private int procedureTypeId;
    @Column(length = 255)
    private String eMPReSSlimID;
    @Basic(optional = false)
    @Column(name = "strain_id", nullable = false)
    private int strainId;
    @Basic(optional = false)
    @Column(name = "centre_id", nullable = false)
    private int centreId;
    @Basic(optional = false)
    @Column(name = "genotype_id", nullable = false)
    private int genotypeId;
    @Basic(optional = false)
    @Column(name = "cohort_id", nullable = false, length = 255)
    private String cohortId;
    @Column(length = 255)
    private String sex;
    @Column(length = 255)
    private String genotype;
    @Column(length = 255)
    private String pipeline;
    @Basic(optional = false)
    @Column(nullable = false)
    private Integer zygosity;

    public ProceduresPerformed() {
    }

    public ProceduresPerformed(Long proceduresPerformedId) {
        this.proceduresPerformedId = proceduresPerformedId;
    }

    public ProceduresPerformed(Long proceduresPerformedId, int procedureTypeId, int strainId, int centreId, int genotypeId, String cohortId, Integer zygosity) {
        this.proceduresPerformedId = proceduresPerformedId;
        this.procedureTypeId = procedureTypeId;
        this.strainId = strainId;
        this.centreId = centreId;
        this.genotypeId = genotypeId;
        this.cohortId = cohortId;
        this.zygosity = zygosity;
    }

    public Long getProceduresPerformedId() {
        return proceduresPerformedId;
    }

    public void setProceduresPerformedId(Long proceduresPerformedId) {
        this.proceduresPerformedId = proceduresPerformedId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getProcedureTypeId() {
        return procedureTypeId;
    }

    public void setProcedureTypeId(int procedureTypeId) {
        this.procedureTypeId = procedureTypeId;
    }

    public String getEMPReSSlimID() {
        return eMPReSSlimID;
    }

    public void setEMPReSSlimID(String eMPReSSlimID) {
        this.eMPReSSlimID = eMPReSSlimID;
    }

    public int getStrainId() {
        return strainId;
    }

    public void setStrainId(int strainId) {
        this.strainId = strainId;
    }

    public int getCentreId() {
        return centreId;
    }

    public void setCentreId(int centreId) {
        this.centreId = centreId;
    }

    public int getGenotypeId() {
        return genotypeId;
    }

    public void setGenotypeId(int genotypeId) {
        this.genotypeId = genotypeId;
    }

    public String getCohortId() {
        return cohortId;
    }

    public void setCohortId(String cohortId) {
        this.cohortId = cohortId;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getGenotype() {
        return genotype;
    }

    public void setGenotype(String genotype) {
        this.genotype = genotype;
    }

    public String getPipeline() {
        return pipeline;
    }

    public void setPipeline(String pipeline) {
        this.pipeline = pipeline;
    }

    public Integer getZygosity() {
        return zygosity;
    }

    public void setZygosity(Integer zygosity) {
        this.zygosity = zygosity;
    }
}
