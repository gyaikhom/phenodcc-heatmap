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
@Table(name = "genotype", catalog = "phenodcc_overviews", schema = "")
@XmlRootElement
public class Genotype implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "genotype_id", nullable = false)
    private Integer genotypeId;
    @Column(length = 255)
    private String genotype;
    @Column(length = 255)
    private String source;
    @Column(name = "allele_name", length = 255)
    private String alleleName;
    @Column(name = "allele_type", length = 255)
    private String alleleType;
    @Column(name = "gene_id", length = 255)
    private String geneId;
    @Column(name = "gene_name", length = 255)
    private String geneName;
    @Column(name = "gene_symbol", length = 255)
    private String geneSymbol;
    @Column(name = "definative_name", length = 255)
    private String definativeName;
    @Column(name = "emma_id", length = 15)
    private String emmaId;
    @Column(name = "komp_id", length = 15)
    private String kompId;
    @Column(name = "jax_id", length = 15)
    private String jaxId;
    @Column(name = "international_strain_name", length = 512)
    private String internationalStrainName;
    @Column(name = "ensembl_id", length = 255)
    private String ensemblId;
    @Column(name = "show_this")
    private Boolean showThis;
    @Column(name = "allele_id", length = 15)
    private String alleleId;
    @Column(name = "epd_id", length = 45)
    private String epdId;
    @Column(name = "stocklist_id", length = 15)
    private String stocklistId;
    @Column(name = "HTGT_project_id", length = 15)
    private String hTGTprojectid;
    @Column(name = "centre_id")
    private Integer centreId;
    @Column(name = "strain_id")
    private Integer strainId;
    @Column(name = "MGI_strain_id", length = 45)
    private String mGIstrainid;

    public Genotype() {
    }

    public Genotype(Integer genotypeId) {
        this.genotypeId = genotypeId;
    }

    public Integer getGenotypeId() {
        return genotypeId;
    }

    public void setGenotypeId(Integer genotypeId) {
        this.genotypeId = genotypeId;
    }

    public String getGenotype() {
        return genotype;
    }

    public void setGenotype(String genotype) {
        this.genotype = genotype;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getAlleleName() {
        return alleleName;
    }

    public void setAlleleName(String alleleName) {
        this.alleleName = alleleName;
    }

    public String getAlleleType() {
        return alleleType;
    }

    public void setAlleleType(String alleleType) {
        this.alleleType = alleleType;
    }

    public String getGeneId() {
        return geneId;
    }

    public void setGeneId(String geneId) {
        this.geneId = geneId;
    }

    public String getGeneName() {
        return geneName;
    }

    public void setGeneName(String geneName) {
        this.geneName = geneName;
    }

    public String getGeneSymbol() {
        return geneSymbol;
    }

    public void setGeneSymbol(String geneSymbol) {
        this.geneSymbol = geneSymbol;
    }

    public String getDefinativeName() {
        return definativeName;
    }

    public void setDefinativeName(String definativeName) {
        this.definativeName = definativeName;
    }

    public String getEmmaId() {
        return emmaId;
    }

    public void setEmmaId(String emmaId) {
        this.emmaId = emmaId;
    }

    public String getKompId() {
        return kompId;
    }

    public void setKompId(String kompId) {
        this.kompId = kompId;
    }

    public String getJaxId() {
        return jaxId;
    }

    public void setJaxId(String jaxId) {
        this.jaxId = jaxId;
    }

    public String getInternationalStrainName() {
        return internationalStrainName;
    }

    public void setInternationalStrainName(String internationalStrainName) {
        this.internationalStrainName = internationalStrainName;
    }

    public String getEnsemblId() {
        return ensemblId;
    }

    public void setEnsemblId(String ensemblId) {
        this.ensemblId = ensemblId;
    }

    public Boolean getShowThis() {
        return showThis;
    }

    public void setShowThis(Boolean showThis) {
        this.showThis = showThis;
    }

    public String getAlleleId() {
        return alleleId;
    }

    public void setAlleleId(String alleleId) {
        this.alleleId = alleleId;
    }

    public String getEpdId() {
        return epdId;
    }

    public void setEpdId(String epdId) {
        this.epdId = epdId;
    }

    public String getStocklistId() {
        return stocklistId;
    }

    public void setStocklistId(String stocklistId) {
        this.stocklistId = stocklistId;
    }

    public String getHTGTprojectid() {
        return hTGTprojectid;
    }

    public void setHTGTprojectid(String hTGTprojectid) {
        this.hTGTprojectid = hTGTprojectid;
    }

    public Integer getCentreId() {
        return centreId;
    }

    public void setCentreId(Integer centreId) {
        this.centreId = centreId;
    }

    public Integer getStrainId() {
        return strainId;
    }

    public void setStrainId(Integer strainId) {
        this.strainId = strainId;
    }

    public String getMGIstrainid() {
        return mGIstrainid;
    }

    public void setMGIstrainid(String mGIstrainid) {
        this.mGIstrainid = mGIstrainid;
    }
}
