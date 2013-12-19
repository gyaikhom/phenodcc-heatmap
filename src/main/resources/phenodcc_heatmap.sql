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

truncate `phenodcc_heatmap`.`parameters_for_procedure_type`;

use impress;

insert into
    `phenodcc_heatmap`.`parameters_for_procedure_type`
(
    `procedure_type`,
    `procedure_name`,
    `parameter_key`,
    `parameter_name`
)

select distinct
    `procedure_super_type`.`id`,
    `procedure_super_type`.`type`,
    `parameter`.`parameter_key`,
    `parameter`.`name`
from `procedure`, `procedure_super_type`, `parameter`, `procedure_has_parameters`, procedure_has_super_type
where `parameter`.`is_annotation` = 1
    and `procedure`.`procedure_id` = `procedure_has_super_type`.`procedure_id`
    and `parameter`.`parameter_id` = `procedure_has_parameters`.`parameter_id`
    and `procedure_has_parameters`.`procedure_id` = `procedure`.`procedure_id`
    and `procedure_super_type`.id = procedure_has_super_type.type
order by
    `procedure`.`name`,
    `parameter`.`name`,
    `procedure`.`type`;
===========================
       END OF CODE
===========================
*/

