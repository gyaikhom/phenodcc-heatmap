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
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

/**
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */
@Entity
@Table(name = "parameters_for_procedure_type", catalog = "phenodcc_heatmap", schema = "")
@XmlRootElement
@XmlType(propOrder = {"i", "t", "k", "n"})
@NamedQueries({
    @NamedQuery(name = "ParametersForProcedureType.findByParameterKey", query = "select p from ParametersForProcedureType p where p.parameterKey = :parameterKey"),
    @NamedQuery(name = "ParametersForProcedureType.getRowEntriesTyped", query = "select distinct new org.mousephenotype.dcc.heatmap.entities.RowEntry(p.parameterKey, p.parameterName) from MeasurementsPerformed e, ParametersForProcedureType p where p.procedureType = :type and e.parameterId = p.parameterKey order by p.parameterName"),
    @NamedQuery(name = "ParametersForProcedureType.getRowEntriesUntyped", query = "select distinct new org.mousephenotype.dcc.heatmap.entities.RowEntry(p.procedureType, p.procedureName) from ParametersForProcedureType p order by p.procedureType"),
    @NamedQuery(name = "ParametersForProcedureType.getColumnEntriesFilter", query = "select distinct g from ProceduresPerformed p, Genotype g where g.genotypeId <> 0 and p.genotypeId = g.genotypeId and g.geneSymbol is not null and g.geneSymbol <> 'null' and g.geneSymbol like :filter order by g.geneSymbol, g.genotypeId"),
    @NamedQuery(name = "ParametersForProcedureType.getColumnEntriesMgiId", query = "select distinct g from ProceduresPerformed p, Genotype g where g.geneId = :mgiId and g.genotypeId <> 0 and p.genotypeId = g.genotypeId and g.geneSymbol is not null and g.geneSymbol <> 'null' order by g.geneSymbol, g.genotypeId"),
    @NamedQuery(name = "ParametersForProcedureType.getSignificanceFilterUntyped", query = "select new org.mousephenotype.dcc.heatmap.entities.Significance(p.procedureType, a.genotypeId, min(a.pvalueDouble), min(case a.zygosity when 1 then a.pvalueDouble else 9999.0 end), min(case a.zygosity when 0 then a.pvalueDouble else 9999.0 end), min(case a.zygosity when 2 then a.pvalueDouble else 9999.0 end), min(a.pvalueSex), min(case a.zygosity when 1 then a.pvalueSex else 9999.0 end), min(case a.zygosity when 0 then a.pvalueSex else 9999.0 end), min(case a.zygosity when 2 then a.pvalueSex else 9999.0 end)) from Annotation a, ParametersForProcedureType p where a.parameterId = p.parameterKey and a.genotypeId in :genotypeIds group by a.genotypeId, p.procedureType order by a.genotypeId, p.procedureType"),
    @NamedQuery(name = "ParametersForProcedureType.getSignificanceFilterTyped", query = "select new org.mousephenotype.dcc.heatmap.entities.Significance(p.parameterKey, a.genotypeId, min(a.pvalueDouble), min(case a.zygosity when 1 then a.pvalueDouble else 9999.0 end), min(case a.zygosity when 0 then a.pvalueDouble else 9999.0 end), min(case a.zygosity when 2 then a.pvalueDouble else 9999.0 end), min(a.pvalueSex), min(case a.zygosity when 1 then a.pvalueSex else 9999.0 end), min(case a.zygosity when 0 then a.pvalueSex else 9999.0 end), min(case a.zygosity when 2 then a.pvalueSex else 9999.0 end)) from Annotation a, ParametersForProcedureType p where p.procedureType = :type and a.parameterId = p.parameterKey and a.genotypeId in :genotypeIds group by a.genotypeId, p.parameterKey order by a.genotypeId, p.parameterName"),
    @NamedQuery(name = "ParametersForProcedureType.getDetails", query = "select new org.mousephenotype.dcc.heatmap.entities.Details(p.parameterKey, p.parameterName, a.zygosity, min(a.pvalueDouble), min(case a.zygosity when 1 then a.pvalueDouble else 9999.0 end), min(case a.zygosity when 0 then a.pvalueDouble else 9999.0 end), min(case a.zygosity when 2 then a.pvalueDouble else 9999.0 end), min(a.pvalueSex), min(case a.zygosity when 1 then a.pvalueSex else 9999.0 end), min(case a.zygosity when 0 then a.pvalueSex else 9999.0 end), min(case a.zygosity when 2 then a.pvalueSex else 9999.0 end), a.yMP) from Annotation a, ParametersForProcedureType p where p.procedureType = :type and a.parameterId = p.parameterKey and a.genotypeId = :genotypeId group by p.parameterKey, a.zygosity order by p.parameterName, a.zygosity"),
    @NamedQuery(name = "ParametersForProcedureType.getParameterDetails", query = "select new org.mousephenotype.dcc.heatmap.entities.Details(p.parameterKey, p.parameterName, a.zygosity, min(a.pvalueDouble), min(case a.zygosity when 1 then a.pvalueDouble else 9999.0 end), min(case a.zygosity when 0 then a.pvalueDouble else 9999.0 end), min(case a.zygosity when 2 then a.pvalueDouble else 9999.0 end), min(a.pvalueSex), min(case a.zygosity when 1 then a.pvalueSex else 9999.0 end), min(case a.zygosity when 0 then a.pvalueSex else 9999.0 end), min(case a.zygosity when 2 then a.pvalueSex else 9999.0 end), a.yMP) from Annotation a, ParametersForProcedureType p where a.parameterId = :parameterKey and a.parameterId = p.parameterKey and a.genotypeId = :genotypeId group by p.parameterKey, a.zygosity order by p.parameterName, a.zygosity")})
public class ParametersForProcedureType implements Serializable {
    
    @Id
    @Basic(optional = false)
    @NotNull
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Column(name = "procedure_type")
    private Integer procedureType;
    @Basic(optional = false)
    @NotNull
    @Column(name = "procedure_name")
    private String procedureName;
    @Basic(optional = false)
    @NotNull
    @Column(name = "parameter_key")
    private String parameterKey;
    @Basic(optional = false)
    @NotNull
    @Column(name = "parameter_name")
    private String parameterName;

    @XmlElement(name = "i")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @XmlElement(name = "t")
    public Integer getProcedureType() {
        return procedureType;
    }

    public void setProcedureType(Integer procedureType) {
        this.procedureType = procedureType;
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
}
