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
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */
@Entity
@Table(name = "param_mpterm", catalog = "impress", schema = "")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "ParamMpterm.findAll", query = "SELECT p FROM ParamMpterm p"),
    @NamedQuery(name = "ParamMpterm.findByParamMptermId", query = "SELECT p FROM ParamMpterm p WHERE p.paramMptermId = :paramMptermId"),
    @NamedQuery(name = "ParamMpterm.findByMpTerm", query = "SELECT p FROM ParamMpterm p WHERE p.mpTerm = :mpTerm"),
    @NamedQuery(name = "ParamMpterm.findByMpId", query = "SELECT p FROM ParamMpterm p WHERE p.mpId = :mpId"),
    @NamedQuery(name = "ParamMpterm.findByWeight", query = "SELECT p FROM ParamMpterm p WHERE p.weight = :weight"),
    @NamedQuery(name = "ParamMpterm.findByDeleted", query = "SELECT p FROM ParamMpterm p WHERE p.deleted = :deleted"),
    @NamedQuery(name = "ParamMpterm.findByOptionId", query = "SELECT p FROM ParamMpterm p WHERE p.optionId = :optionId"),
    @NamedQuery(name = "ParamMpterm.findByIncrementId", query = "SELECT p FROM ParamMpterm p WHERE p.incrementId = :incrementId"),
    @NamedQuery(name = "ParamMpterm.findBySex", query = "SELECT p FROM ParamMpterm p WHERE p.sex = :sex"),
    @NamedQuery(name = "ParamMpterm.findBySelectionOutcome", query = "SELECT p FROM ParamMpterm p WHERE p.selectionOutcome = :selectionOutcome"),
    @NamedQuery(name = "ParamMpterm.findByUserId", query = "SELECT p FROM ParamMpterm p WHERE p.userId = :userId"),
    @NamedQuery(name = "ParamMpterm.findByTimeModified", query = "SELECT p FROM ParamMpterm p WHERE p.timeModified = :timeModified")})
public class ParamMpterm implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "param_mpterm_id", nullable = false)
    private Integer paramMptermId;
    @Basic(optional = false)
    @Column(name = "mp_term", nullable = false, length = 255)
    private String mpTerm;
    @Basic(optional = false)
    @Column(name = "mp_id", nullable = false, length = 11)
    private String mpId;
    @Basic(optional = false)
    @Column(nullable = false)
    private int weight;
    @Basic(optional = false)
    @Column(nullable = false)
    private boolean deleted;
    @Column(name = "option_id")
    private Integer optionId;
    @Column(name = "increment_id")
    private Integer incrementId;
    @Column(length = 2)
    private String sex;
    @Column(name = "selection_outcome", length = 10)
    private String selectionOutcome;
    @Column(name = "user_id")
    private Integer userId;
    @Column(name = "time_modified")
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeModified;
    @JoinColumn(name = "parameter_id", referencedColumnName = "parameter_id")
    @ManyToOne
    private Parameter parameterId;

    public ParamMpterm() {
    }

    public ParamMpterm(Integer paramMptermId) {
        this.paramMptermId = paramMptermId;
    }

    public ParamMpterm(Integer paramMptermId, String mpTerm, String mpId, int weight, boolean deleted) {
        this.paramMptermId = paramMptermId;
        this.mpTerm = mpTerm;
        this.mpId = mpId;
        this.weight = weight;
        this.deleted = deleted;
    }

    public Integer getParamMptermId() {
        return paramMptermId;
    }

    public void setParamMptermId(Integer paramMptermId) {
        this.paramMptermId = paramMptermId;
    }

    public String getMpTerm() {
        return mpTerm;
    }

    public void setMpTerm(String mpTerm) {
        this.mpTerm = mpTerm;
    }

    public String getMpId() {
        return mpId;
    }

    public void setMpId(String mpId) {
        this.mpId = mpId;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Integer getOptionId() {
        return optionId;
    }

    public void setOptionId(Integer optionId) {
        this.optionId = optionId;
    }

    public Integer getIncrementId() {
        return incrementId;
    }

    public void setIncrementId(Integer incrementId) {
        this.incrementId = incrementId;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getSelectionOutcome() {
        return selectionOutcome;
    }

    public void setSelectionOutcome(String selectionOutcome) {
        this.selectionOutcome = selectionOutcome;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Date getTimeModified() {
        return timeModified;
    }

    public void setTimeModified(Date timeModified) {
        this.timeModified = timeModified;
    }

    public Parameter getParameterId() {
        return parameterId;
    }

    public void setParameterId(Parameter parameterId) {
        this.parameterId = parameterId;
    }
}
