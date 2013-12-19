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
package org.mousephenotype.dcc.heatmap.webservice;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import org.mousephenotype.dcc.heatmap.entities.CellDetails;
import org.mousephenotype.dcc.heatmap.entities.Centre;
import org.mousephenotype.dcc.heatmap.entities.ColumnEntry;
import org.mousephenotype.dcc.heatmap.entities.Details;
import org.mousephenotype.dcc.heatmap.entities.Genotype;
import org.mousephenotype.dcc.heatmap.entities.Heatmap;
import org.mousephenotype.dcc.heatmap.entities.ParamMpterm;
import org.mousephenotype.dcc.heatmap.entities.ParametersForProcedureType;
import org.mousephenotype.dcc.heatmap.entities.RowEntry;
import org.mousephenotype.dcc.heatmap.entities.Significance;
import org.mousephenotype.dcc.heatmap.entities.Strain;

/**
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */
@Stateless
@Path("procedural")
public class ParametersForProcedureTypeFacadeREST extends AbstractFacade<ParametersForProcedureType> {

    public ParametersForProcedureTypeFacadeREST() {
        super(ParametersForProcedureType.class);
    }

    private List<RowEntry> getRowEntries(Integer type) {
        TypedQuery<RowEntry> query;
        EntityManager em = getEntityManager();
        if (type == null) {
            query = em.createNamedQuery(
                    "ParametersForProcedureType.getRowEntriesUntyped",
                    RowEntry.class);
        } else {
            query = em.createNamedQuery(
                    "ParametersForProcedureType.getRowEntriesTyped",
                    RowEntry.class);
            query.setParameter("type", type);
        }
        List<RowEntry> rowEntries = query.getResultList();
        em.close();
        return rowEntries;
    }

    private List<ColumnEntry> getColumnEntriesByFilter(String filter) {
        EntityManager em = getEntityManager();
        TypedQuery<ColumnEntry> query = em.createNamedQuery(
                "ParametersForProcedureType.getColumnEntriesFilter",
                ColumnEntry.class);
        query.setParameter("filter", filter + "%");
        List<ColumnEntry> columnEntries = query.getResultList();
        em.close();
        return columnEntries;
    }

    private List<ColumnEntry> getColumnEntriesByMgiId(String mgiId) {
        EntityManager em = getEntityManager();
        TypedQuery<Genotype> query;
        query = em.createNamedQuery(
                "ParametersForProcedureType.getColumnEntriesMgiId",
                Genotype.class);
        query.setParameter("mgiId", mgiId);
        List<ColumnEntry> columnEntries = new ArrayList<>();
        List<Genotype> genes = query.getResultList();
        Iterator<Genotype> i = genes.iterator();
        while (i.hasNext()) {
            Genotype g = i.next();
            ColumnEntry c = new ColumnEntry();
            c.setKey(g.getGenotypeId());
            c.setAllele(g.getAlleleName());
            c.setSymbol(g.getGeneSymbol());

            Centre centre = em.find(Centre.class, g.getCentreId());
            if (centre != null) {
                c.setCentre(centre.getFullName());
                c.setIlar(centre.getShortName());
            }

            Strain strain = em.find(Strain.class, g.getStrainId());
            if (strain != null) {
                c.setStrain(strain.getStrain());
            }
            columnEntries.add(c);
        }
        em.close();
        return columnEntries;
    }

    private Double[][] getSignificance(
            List<RowEntry> rows,
            List<ColumnEntry> columns,
            Integer type) {
        EntityManager em = getEntityManager();
        TypedQuery<Significance> query;

        if (columns.isEmpty() || rows.isEmpty()) {
            return new Double[0][0];
        }

        if (type == null) {
            query = em.createNamedQuery("ParametersForProcedureType.getSignificanceFilterUntyped", Significance.class);
        } else {
            query = em.createNamedQuery("ParametersForProcedureType.getSignificanceFilterTyped", Significance.class);
            query.setParameter("type", type);
        }

        Collection<String> genotypeIds = new ArrayList<>();
        for (int i = 0, ncol = columns.size(); i < ncol; ++i) {
            genotypeIds.add(columns.get(i).getKey().toString());
        }
        query.setParameter("genotypeIds", genotypeIds);

        List<Significance> significance = query.getResultList();
        em.close();
        return toGrid(significance, rows, columns);
    }

    private Double[][] toGrid(
            List<Significance> significance,
            List<RowEntry> rows,
            List<ColumnEntry> columns) {
        int i, j, nrow = rows.size(), ncol = columns.size();
        HashMap<String, Integer> rowIndex = new HashMap<>();
        HashMap<String, Integer> columnIndex = new HashMap<>();

        for (i = 0; i < nrow; ++i) {
            rowIndex.put(rows.get(i).getKey(), i);
        }

        for (i = 0; i < ncol; ++i) {
            columnIndex.put(columns.get(i).getKey().toString(), i);
        }

        Double[][] pvalues = new Double[nrow][ncol];
        for (i = 0; i < nrow; ++i) {
            for (j = 0; j < ncol; ++j) {
                pvalues[i][j] = -1.0;
            }
        }

        Iterator<Significance> iterator = significance.iterator();
        while (iterator.hasNext()) {
            Significance s = iterator.next();
            i = rowIndex.get(s.getKey());
            j = columnIndex.get(s.getGenotypeId().toString());
            pvalues[i][j] = s.getPvalue();
        }
        return pvalues;
    }

    private int getSelectionOutcome(String o) {
        int outcome = -1;
        switch (o) {
            case "INCREASED":
                outcome = 1;
                break;
            case "DECREASED":
                outcome = 2;
                break;
            case "ABNORMAL":
                outcome = 3;
                break;
            case "INFERRED":
                outcome = 4;
                break;
        }
        return outcome;
    }

    private void setMpTerm(EntityManager em, Details d) {
        TypedQuery<ParamMpterm> query;
        query = em.createNamedQuery("ParamMpterm.findByMpId", ParamMpterm.class);
        query.setParameter("mpId", d.getMpId());
        query.setMaxResults(1);
        try {
            ParamMpterm r = query.getSingleResult();
            if (r != null) {
                d.setMpTerm(r.getMpTerm());
                d.setSelectionOutcome(getSelectionOutcome(r.getSelectionOutcome()));
            }
        } catch (Exception e) {
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("heatmap")
    public HeatmapPack getByMgiId(
            @QueryParam("type") Integer type,
            @QueryParam("mgiid") String mgiId) {
        HeatmapPack p = new HeatmapPack();
        List<RowEntry> r = getRowEntries(type);
        List<ColumnEntry> c = getColumnEntriesByMgiId(mgiId);
        Double[][] v = getSignificance(r, c, type);
        Heatmap heatmap = new Heatmap("A heatmap", r, c, v);
        p.setData(heatmap);
        return p;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("byfilter")
    public HeatmapPack getFiltered(
            @QueryParam("type") Integer type,
            @QueryParam("filter") String filter) {
        HeatmapPack p = new HeatmapPack();
        List<RowEntry> r = getRowEntries(type);
        List<ColumnEntry> c = getColumnEntriesByFilter(filter);
        Double[][] v = getSignificance(r, c, type);
        Heatmap heatmap = new Heatmap("A heatmap", r, c, v);
        p.setData(heatmap);
        return p;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("rows")
    public List<RowEntry> getRows(
            @QueryParam("type") Integer type,
            @QueryParam("mgiid") String mgiid) {
        return getRowEntries(type);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("details")
    public CellDetailsPack getDetails(
            @QueryParam("type") Integer type,
            @QueryParam("gid") Integer genotypeId,
            @QueryParam("threshold") Double threshold) {
        CellDetailsPack p = new CellDetailsPack();

        if (threshold == null) {
            threshold = 1.0;
        } else {
            if (threshold < 0.0) {
                threshold = 0.0;
            } else if (threshold > 1.0) {
                threshold = 1.0;
            }
        }

        EntityManager em = getEntityManager();
        TypedQuery<Details> query;
        query = em.createNamedQuery("ParametersForProcedureType.getDetails", Details.class);
        query.setParameter("type", type);
        query.setParameter("genotypeId", genotypeId);
        query.setParameter("threshold", threshold);
        List<Details> tempDetails = query.getResultList();
        for (Details x : tempDetails) {
            setMpTerm(em, x);
        }
        CellDetails details = new CellDetails(tempDetails);
        em.close();

        p.setData(details);
        return p;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("details/parameter")
    public CellDetailsPack getParameterDetails(
            @QueryParam("type") String parameterKey,
            @QueryParam("gid") Integer genotypeId,
            @QueryParam("threshold") Double threshold) {
        CellDetailsPack p = new CellDetailsPack();

        if (threshold == null) {
            threshold = 1.0;
        } else {
            if (threshold < 0.0) {
                threshold = 0.0;
            } else if (threshold > 1.0) {
                threshold = 1.0;
            }
        }

        EntityManager em = getEntityManager();
        TypedQuery<Details> query;
        query = em.createNamedQuery("ParametersForProcedureType.getParameterDetails", Details.class);
        query.setParameter("parameterKey", parameterKey);
        query.setParameter("genotypeId", genotypeId);
        query.setParameter("threshold", threshold);
        List<Details> tempDetails = query.getResultList();
        for (Details x : tempDetails) {
            setMpTerm(em, x);
        }
        CellDetails details = new CellDetails(tempDetails);
        em.close();

        p.setData(details);
        return p;
    }
}
