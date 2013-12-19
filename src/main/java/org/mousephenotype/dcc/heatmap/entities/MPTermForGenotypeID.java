/*
 * Copyright 2013 Medical Research Council Harwell
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
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author duncan
 */
@Entity
@Table(name = "annotation", catalog = "phenodcc_annotations", schema = "")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "MPTermForGenotypeID.getRowEntriesTyped", query = "select distinct new org.mousephenotype.dcc.heatmap.entities.RowEntry(a.yMP, t.termName) from Annotation a, Term t where a.yMP1 = :type and a.yMP is not null and a.yMP = t.identifier order by a.yMP"),
    @NamedQuery(name = "MPTermForGenotypeID.getRowEntriesUntyped", query = "select distinct new org.mousephenotype.dcc.heatmap.entities.RowEntry(a.yMP1, t.termName) from Annotation a, Term t where a.yMP1 is not null and a.yMP1 = t.identifier order by a.yMP1"),
    @NamedQuery(name = "MPTermForGenotypeID.getColumnEntriesFilter", query = "select distinct g from ProceduresPerformed p, Genotype g where g.genotypeId <> 0 and p.genotypeId = g.genotypeId and g.geneSymbol is not null and g.geneSymbol <> 'null' and g.geneSymbol like :filter order by g.geneSymbol, g.genotypeId"),
    @NamedQuery(name = "MPTermForGenotypeID.getColumnEntriesMgiId", query = "select distinct g from ProceduresPerformed p, Genotype g where g.geneId = :mgiId and g.genotypeId <> 0 and p.genotypeId = g.genotypeId and g.geneSymbol is not null and g.geneSymbol <> 'null' order by g.geneSymbol, g.genotypeId"),
    @NamedQuery(name = "MPTermForGenotypeID.getSignificanceFilterUntyped", query = "select new org.mousephenotype.dcc.heatmap.entities.Significance(a.yMP1, a.genotypeId, min(a.pvalueDouble)) from Annotation a where a.genotypeId in :genotypeIds and a.yMP1 in :mpterms group by a.yMP1, a.genotypeId order by a.yMP1, a.genotypeId"),
    @NamedQuery(name = "MPTermForGenotypeID.getSignificanceFilterTyped", query = "select new org.mousephenotype.dcc.heatmap.entities.Significance(a.yMP, a.genotypeId, min(a.pvalueDouble)) from Annotation a where a.yMP1 = :type and a.genotypeId in :genotypeIds and a.yMP in :mpterms group by a.yMP, a.genotypeId order by a.yMP, a.genotypeId"),
    @NamedQuery(name = "MPTermForGenotypeID.getDetails", query = "select distinct new org.mousephenotype.dcc.heatmap.entities.Details(p.parameterKey, p.parameterName, min(a.pvalueDouble), a.yMP) from Annotation a, ParametersForProcedureType p where a.parameterId = p.parameterKey and a.genotypeId = :genotypeId and a.pvalueDouble < :threshold and (a.yMP1 = :type or a.yMP = :type) group by p.parameterKey order by p.parameterName")})
public class MPTermForGenotypeID implements Serializable {

    @Id
    @Basic(optional = false)
    @NotNull
    private Integer id;

    public MPTermForGenotypeID() {
    }
}
