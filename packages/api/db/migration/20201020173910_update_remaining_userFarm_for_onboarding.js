/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (20200629080929_migrate_user_to_userfarm.js) is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

exports.up = async function(knex) {
    await knex.raw(`
    UPDATE "userFarm" 
    SET step_one_end = NOW()
    `);
    await knex.raw(`
    UPDATE "userFarm" 
    SET step_two = true
    `);
    await knex.raw(`
    UPDATE "userFarm" 
    SET step_two_end = NOW()
    `);
    await knex.raw(`
    UPDATE "userFarm" 
    SET step_three = true
    `);
    await knex.raw(`
    UPDATE "userFarm" 
    SET step_three_end = NOW()
    `);
    await knex.raw(`
    UPDATE "userFarm" 
    SET step_four = true
    `);
    await knex.raw(`
    UPDATE "userFarm" 
    SET step_four_end = NOW()
    `);
  };
  
  exports.down = function(knex) {
  
  };