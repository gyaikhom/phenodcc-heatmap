/******************************************************************************
 *                     The PhenoDCC HeatMap Database                          *
 *                                                                            *
 * DESCRIPTION:                                                               *
 * This database maps procedure type to procedures and parameters.            *
 *                                                                            *
 * NOTE:                                                                      *
 * This file contains SQL statements that must be run when                    *
 * parameter/procedure association changes in IMPReSS.                        *
 *                                                                            *
 * Copyright (c) 2013, Medical Research Council Harwell                       *
 * Written by: G. Yaikhom (g.yaikhom@har.mrc.ac.uk)                           *
 *                                                                            *
 *****************************************************************************/

/**
 * Require impress database for parameter/procedure associations. This
 * database must be made accessible to 'dccadmin'@'localhost'.
 */
drop database if exists phenodcc_heatmap;
create database phenodcc_heatmap;
grant all on phenodcc_heatmap.* to 'dccadmin'@'localhost';
flush privileges;

use phenodcc_heatmap;
create table parameters_for_procedure_type (
    id int not null auto_increment,
    procedure_type int(11) not null,
    procedure_name varchar(255) not null,
    parameter_key varchar(100) not null,
    parameter_name varchar(255) not null,
    primary key (id),
    index (procedure_type),
    index (parameter_key)
) engine = innodb;

/**
 * Run the following every time the parameter/procedure association changes.
 * This will fill the tables defined above.
 
===========================
      START OF CODE (new)
===========================

use impress;
truncate phenodcc_heatmap.parameters_for_procedure_type;

insert into
    phenodcc_heatmap.parameters_for_procedure_type
(
    procedure_type,
    procedure_name,
    parameter_key,
    parameter_name
)
select distinct
    pst.id,
    pst.`type`,
    q.parameter_key,
    q.`name`
from
	impress.pipeline as l
    left join impress.pipeline_has_procedures as php on (l.pipeline_id = php.pipeline_id)
    left join impress.`procedure` as p on (php.procedure_id = p.procedure_id)
    left join impress.procedure_has_parameters as phq on (php.procedure_id = phq.procedure_id)
    left join impress.parameter as q on (phq.parameter_id = q.parameter_id)
    left join impress.procedure_has_super_type as phst on (phst.procedure_id = p.procedure_id)
    left join impress.procedure_super_type as pst on (pst.id = phst.`type`)
where
	l.impc = 1
    and l.visible = 1
    and l.active = 1
    and l.deprecated = 0
    and l.internal = 0
    and l.deleted = 0
    and php.is_visible = 1
    and php.is_active = 1
    and php.is_internal = 0
    and php.is_deprecated = 0
    and php.is_internal = 0
    and php.is_deleted = 0
    and q.visible = 1
    and q.active = 1
    and q.deprecated = 0
    and q.internal = 0
    and q.deleted = 0
    and q.is_annotation = 1
    and q.`type` != 'procedureMetadata'
    and q.graph_type is not null
    and q.graph_type != 'NULL' 
    and pst.`type` is not null
;

===========================
       END OF CODE
===========================
*/

