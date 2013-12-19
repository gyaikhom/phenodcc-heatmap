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
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author duncan
 */
@Entity
@Table(name = "term", catalog = "ols", schema = "")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Term.findAll", query = "SELECT t FROM Term t"),
    @NamedQuery(name = "Term.findByTermPk", query = "SELECT t FROM Term t WHERE t.termPk = :termPk"),
    @NamedQuery(name = "Term.findByOntologyId", query = "SELECT t FROM Term t WHERE t.ontologyId = :ontologyId"),
    @NamedQuery(name = "Term.findByTermName", query = "SELECT t FROM Term t WHERE t.termName = :termName"),
    @NamedQuery(name = "Term.findByIdentifier", query = "SELECT t FROM Term t WHERE t.identifier = :identifier"),
    @NamedQuery(name = "Term.findByNamespace", query = "SELECT t FROM Term t WHERE t.namespace = :namespace"),
    @NamedQuery(name = "Term.findByIsObsolete", query = "SELECT t FROM Term t WHERE t.isObsolete = :isObsolete"),
    @NamedQuery(name = "Term.findByIsRootTerm", query = "SELECT t FROM Term t WHERE t.isRootTerm = :isRootTerm"),
    @NamedQuery(name = "Term.findByIsLeaf", query = "SELECT t FROM Term t WHERE t.isLeaf = :isLeaf")})
public class Term implements Serializable {
    
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "term_pk")
    private String termPk;
    @Basic(optional = false)
    @NotNull
    @Column(name = "ontology_id")
    private int ontologyId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1000)
    @Column(name = "term_name")
    private String termName;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "identifier")
    private String identifier;
    @Lob
    @Size(max = 65535)
    @Column(name = "definition")
    private String definition;
    @Size(max = 255)
    @Column(name = "namespace")
    private String namespace;
    @Column(name = "is_obsolete")
    private Character isObsolete;
    @Column(name = "is_root_term")
    private Character isRootTerm;
    @Column(name = "is_leaf")
    private Character isLeaf;

    public Term() {
    }

    public Term(String termPk) {
        this.termPk = termPk;
    }

    public Term(String termPk, int ontologyId, String termName, String identifier) {
        this.termPk = termPk;
        this.ontologyId = ontologyId;
        this.termName = termName;
        this.identifier = identifier;
    }

    public String getTermPk() {
        return termPk;
    }

    public void setTermPk(String termPk) {
        this.termPk = termPk;
    }

    public int getOntologyId() {
        return ontologyId;
    }

    public void setOntologyId(int ontologyId) {
        this.ontologyId = ontologyId;
    }

    public String getTermName() {
        return termName;
    }

    public void setTermName(String termName) {
        this.termName = termName;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public Character getIsObsolete() {
        return isObsolete;
    }

    public void setIsObsolete(Character isObsolete) {
        this.isObsolete = isObsolete;
    }

    public Character getIsRootTerm() {
        return isRootTerm;
    }

    public void setIsRootTerm(Character isRootTerm) {
        this.isRootTerm = isRootTerm;
    }

    public Character getIsLeaf() {
        return isLeaf;
    }

    public void setIsLeaf(Character isLeaf) {
        this.isLeaf = isLeaf;
    }
}
