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
import java.util.Collection;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */
@Entity
@Table(name = "parameter", catalog = "impress", schema = "", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"parameter_key"})})
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Parameter.findAll", query = "SELECT p FROM Parameter p"),
    @NamedQuery(name = "Parameter.findByParameterId", query = "SELECT p FROM Parameter p WHERE p.parameterId = :parameterId"),
    @NamedQuery(name = "Parameter.findByParameterKey", query = "SELECT p FROM Parameter p WHERE p.parameterKey = :parameterKey"),
    @NamedQuery(name = "Parameter.findByType", query = "SELECT p FROM Parameter p WHERE p.type = :type"),
    @NamedQuery(name = "Parameter.findByName", query = "SELECT p FROM Parameter p WHERE p.name = :name"),
    @NamedQuery(name = "Parameter.findByVisible", query = "SELECT p FROM Parameter p WHERE p.visible = :visible"),
    @NamedQuery(name = "Parameter.findByActive", query = "SELECT p FROM Parameter p WHERE p.active = :active"),
    @NamedQuery(name = "Parameter.findByDeprecated", query = "SELECT p FROM Parameter p WHERE p.deprecated = :deprecated"),
    @NamedQuery(name = "Parameter.findByMajorVersion", query = "SELECT p FROM Parameter p WHERE p.majorVersion = :majorVersion"),
    @NamedQuery(name = "Parameter.findByMinorVersion", query = "SELECT p FROM Parameter p WHERE p.minorVersion = :minorVersion"),
    @NamedQuery(name = "Parameter.findByIsAnnotation", query = "SELECT p FROM Parameter p WHERE p.isAnnotation = :isAnnotation"),
    @NamedQuery(name = "Parameter.findByIsDerived", query = "SELECT p FROM Parameter p WHERE p.isDerived = :isDerived"),
    @NamedQuery(name = "Parameter.findByIsImportant", query = "SELECT p FROM Parameter p WHERE p.isImportant = :isImportant"),
    @NamedQuery(name = "Parameter.findByIsIncrement", query = "SELECT p FROM Parameter p WHERE p.isIncrement = :isIncrement"),
    @NamedQuery(name = "Parameter.findByIsMedia", query = "SELECT p FROM Parameter p WHERE p.isMedia = :isMedia"),
    @NamedQuery(name = "Parameter.findByIsMeta", query = "SELECT p FROM Parameter p WHERE p.isMeta = :isMeta"),
    @NamedQuery(name = "Parameter.findByIsOption", query = "SELECT p FROM Parameter p WHERE p.isOption = :isOption"),
    @NamedQuery(name = "Parameter.findByIsRequired", query = "SELECT p FROM Parameter p WHERE p.isRequired = :isRequired"),
    @NamedQuery(name = "Parameter.findByQcCheck", query = "SELECT p FROM Parameter p WHERE p.qcCheck = :qcCheck"),
    @NamedQuery(name = "Parameter.findByQcMin", query = "SELECT p FROM Parameter p WHERE p.qcMin = :qcMin"),
    @NamedQuery(name = "Parameter.findByQcMax", query = "SELECT p FROM Parameter p WHERE p.qcMax = :qcMax"),
    @NamedQuery(name = "Parameter.findByValueType", query = "SELECT p FROM Parameter p WHERE p.valueType = :valueType"),
    @NamedQuery(name = "Parameter.findByGraphType", query = "SELECT p FROM Parameter p WHERE p.graphType = :graphType"),
    @NamedQuery(name = "Parameter.findByTimeModified", query = "SELECT p FROM Parameter p WHERE p.timeModified = :timeModified"),
    @NamedQuery(name = "Parameter.findByUserId", query = "SELECT p FROM Parameter p WHERE p.userId = :userId"),
    @NamedQuery(name = "Parameter.findByInternal", query = "SELECT p FROM Parameter p WHERE p.internal = :internal"),
    @NamedQuery(name = "Parameter.findByDeleted", query = "SELECT p FROM Parameter p WHERE p.deleted = :deleted"),
    @NamedQuery(name = "Parameter.findByOldParameterKey", query = "SELECT p FROM Parameter p WHERE p.oldParameterKey = :oldParameterKey")})
public class Parameter implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "parameter_id", nullable = false)
    private Integer parameterId;
    @Column(name = "parameter_key", length = 100)
    private String parameterKey;
    @Column(length = 20)
    private String type;
    @Column(length = 255)
    private String name;
    @Basic(optional = false)
    @Column(nullable = false)
    private boolean visible;
    @Basic(optional = false)
    @Column(nullable = false)
    private boolean active;
    @Basic(optional = false)
    @Column(nullable = false)
    private boolean deprecated;
    @Basic(optional = false)
    @Column(name = "major_version", nullable = false)
    private int majorVersion;
    @Basic(optional = false)
    @Column(name = "minor_version", nullable = false)
    private int minorVersion;
    @Lob
    @Column(length = 65535)
    private String derivation;
    @Lob
    @Column(length = 65535)
    private String description;
    @Basic(optional = false)
    @Column(name = "is_annotation", nullable = false)
    private boolean isAnnotation;
    @Basic(optional = false)
    @Column(name = "is_derived", nullable = false)
    private boolean isDerived;
    @Basic(optional = false)
    @Column(name = "is_important", nullable = false)
    private boolean isImportant;
    @Basic(optional = false)
    @Column(name = "is_increment", nullable = false)
    private boolean isIncrement;
    @Basic(optional = false)
    @Column(name = "is_media", nullable = false)
    private boolean isMedia;
    @Basic(optional = false)
    @Column(name = "is_meta", nullable = false)
    private boolean isMeta;
    @Basic(optional = false)
    @Column(name = "is_option", nullable = false)
    private boolean isOption;
    @Basic(optional = false)
    @Column(name = "is_required", nullable = false)
    private boolean isRequired;
    @Basic(optional = false)
    @Column(name = "qc_check", nullable = false)
    private boolean qcCheck;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "qc_min", precision = 12)
    private Float qcMin;
    @Column(name = "qc_max", precision = 12)
    private Float qcMax;
    @Lob
    @Column(name = "qc_notes", length = 65535)
    private String qcNotes;
    @Basic(optional = false)
    @Column(name = "value_type", nullable = false, length = 8)
    private String valueType;
    @Column(name = "graph_type", length = 11)
    private String graphType;
    @Lob
    @Column(name = "data_analysis_notes", length = 65535)
    private String dataAnalysisNotes;
    @Column(name = "time_modified")
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeModified;
    @Basic(optional = false)
    @Column(name = "user_id", nullable = false)
    private int userId;
    @Basic(optional = false)
    @Column(nullable = false)
    private boolean internal;
    @Basic(optional = false)
    @Column(nullable = false)
    private boolean deleted;
    @Column(name = "old_parameter_key", length = 100)
    private String oldParameterKey;
    @JoinColumn(name = "unit", referencedColumnName = "id")
    @ManyToOne
    private Units unit;
    @OneToMany(mappedBy = "parameterId")
    private Collection<ParamMpterm> paramMptermCollection;

    public Parameter() {
    }

    public Parameter(Integer parameterId) {
        this.parameterId = parameterId;
    }

    public Parameter(Integer parameterId, boolean visible, boolean active, boolean deprecated, int majorVersion, int minorVersion, boolean isAnnotation, boolean isDerived, boolean isImportant, boolean isIncrement, boolean isMedia, boolean isMeta, boolean isOption, boolean isRequired, boolean qcCheck, String valueType, int userId, boolean internal, boolean deleted) {
        this.parameterId = parameterId;
        this.visible = visible;
        this.active = active;
        this.deprecated = deprecated;
        this.majorVersion = majorVersion;
        this.minorVersion = minorVersion;
        this.isAnnotation = isAnnotation;
        this.isDerived = isDerived;
        this.isImportant = isImportant;
        this.isIncrement = isIncrement;
        this.isMedia = isMedia;
        this.isMeta = isMeta;
        this.isOption = isOption;
        this.isRequired = isRequired;
        this.qcCheck = qcCheck;
        this.valueType = valueType;
        this.userId = userId;
        this.internal = internal;
        this.deleted = deleted;
    }

    public Integer getParameterId() {
        return parameterId;
    }

    public void setParameterId(Integer parameterId) {
        this.parameterId = parameterId;
    }

    public String getParameterKey() {
        return parameterKey;
    }

    public void setParameterKey(String parameterKey) {
        this.parameterKey = parameterKey;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public boolean getActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean getDeprecated() {
        return deprecated;
    }

    public void setDeprecated(boolean deprecated) {
        this.deprecated = deprecated;
    }

    public int getMajorVersion() {
        return majorVersion;
    }

    public void setMajorVersion(int majorVersion) {
        this.majorVersion = majorVersion;
    }

    public int getMinorVersion() {
        return minorVersion;
    }

    public void setMinorVersion(int minorVersion) {
        this.minorVersion = minorVersion;
    }

    public String getDerivation() {
        return derivation;
    }

    public void setDerivation(String derivation) {
        this.derivation = derivation;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean getIsAnnotation() {
        return isAnnotation;
    }

    public void setIsAnnotation(boolean isAnnotation) {
        this.isAnnotation = isAnnotation;
    }

    public boolean getIsDerived() {
        return isDerived;
    }

    public void setIsDerived(boolean isDerived) {
        this.isDerived = isDerived;
    }

    public boolean getIsImportant() {
        return isImportant;
    }

    public void setIsImportant(boolean isImportant) {
        this.isImportant = isImportant;
    }

    public boolean getIsIncrement() {
        return isIncrement;
    }

    public void setIsIncrement(boolean isIncrement) {
        this.isIncrement = isIncrement;
    }

    public boolean getIsMedia() {
        return isMedia;
    }

    public void setIsMedia(boolean isMedia) {
        this.isMedia = isMedia;
    }

    public boolean getIsMeta() {
        return isMeta;
    }

    public void setIsMeta(boolean isMeta) {
        this.isMeta = isMeta;
    }

    public boolean getIsOption() {
        return isOption;
    }

    public void setIsOption(boolean isOption) {
        this.isOption = isOption;
    }

    public boolean getIsRequired() {
        return isRequired;
    }

    public void setIsRequired(boolean isRequired) {
        this.isRequired = isRequired;
    }

    public boolean getQcCheck() {
        return qcCheck;
    }

    public void setQcCheck(boolean qcCheck) {
        this.qcCheck = qcCheck;
    }

    public Float getQcMin() {
        return qcMin;
    }

    public void setQcMin(Float qcMin) {
        this.qcMin = qcMin;
    }

    public Float getQcMax() {
        return qcMax;
    }

    public void setQcMax(Float qcMax) {
        this.qcMax = qcMax;
    }

    public String getQcNotes() {
        return qcNotes;
    }

    public void setQcNotes(String qcNotes) {
        this.qcNotes = qcNotes;
    }

    public String getValueType() {
        return valueType;
    }

    public void setValueType(String valueType) {
        this.valueType = valueType;
    }

    public String getGraphType() {
        return graphType;
    }

    public void setGraphType(String graphType) {
        this.graphType = graphType;
    }

    public String getDataAnalysisNotes() {
        return dataAnalysisNotes;
    }

    public void setDataAnalysisNotes(String dataAnalysisNotes) {
        this.dataAnalysisNotes = dataAnalysisNotes;
    }

    public Date getTimeModified() {
        return timeModified;
    }

    public void setTimeModified(Date timeModified) {
        this.timeModified = timeModified;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public boolean getInternal() {
        return internal;
    }

    public void setInternal(boolean internal) {
        this.internal = internal;
    }

    public boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public String getOldParameterKey() {
        return oldParameterKey;
    }

    public void setOldParameterKey(String oldParameterKey) {
        this.oldParameterKey = oldParameterKey;
    }

    public Units getUnit() {
        return unit;
    }

    public void setUnit(Units unit) {
        this.unit = unit;
    }

    @XmlTransient
    public Collection<ParamMpterm> getParamMptermCollection() {
        return paramMptermCollection;
    }

    public void setParamMptermCollection(Collection<ParamMpterm> paramMptermCollection) {
        this.paramMptermCollection = paramMptermCollection;
    }
}
