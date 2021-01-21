/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (insightsAPI.test.js) is part of LiteFarm.
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

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const chai_assert = chai.assert;    // Using Assert style
const chai_expect = chai.expect;    // Using Expect style
const chai_should = chai.should();  // Using Should style
const knex = require('../src/util/knex');
const server = require('./../src/server');
const mocks = require('./mock.factories');
const { tableCleanup } = require('./testEnvironment');
const insightHelpers = require('../src/controllers/insightHelpers.js');
jest.mock('jsdom');
jest.mock('../src/middleware/acl/checkJwt');
let faker = require('faker');
const moment = require('moment');

describe('insights test', () => {
  let middleware;
  beforeAll(() => {
    middleware = require('../src/middleware/acl/checkJwt');
    middleware.mockImplementation((req, res, next) => {
      next();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  afterAll(async (done) => {
    await tableCleanup(knex);
    await knex.destroy();
    done();
  });

  describe('People Fed', () => {
    test('Should get people fed if Im on my farm as an owner', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(1);
      getInsight(farm_id, user_id, 'people_fed', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
    test('Should get people fed if Im on my farm as a manager', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(2);
      getInsight(farm_id, user_id, 'people_fed', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });

    test('Should get people fed if Im on my farm as a worker', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(3);
      getInsight(farm_id, user_id, 'people_fed', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
  });

  describe('Soil Om', () => {
    test('Should get soil om if Im on my farm as an owner', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(1);
      getInsight(farm_id, user_id, 'soil_om', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
    test('Should get soil om if Im on my farm as a manager', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(2);
      getInsight(farm_id, user_id, 'soil_om', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });

    test('Should get soil om if Im on my farm as a worker', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(3);
      getInsight(farm_id, user_id, 'soil_om', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
  });

  describe('labour happiness', () => {
    test('Should get labour happiness if Im on my farm as an owner', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(1);
      getInsight(farm_id, user_id, 'labour_happiness', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
    test('Should get labour happiness if Im on my farm as a manager', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(2);
      getInsight(farm_id, user_id, 'labour_happiness', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });

    test('Should get labour happiness if Im on my farm as a worker', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(3);
      getInsight(farm_id, user_id, 'labour_happiness', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
  });

  describe('biodiversity', () => {
    test('Should get biodiversity if Im on my farm as an owner', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(1);
      getInsight(farm_id, user_id, 'biodiversity', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
    test('Should get biodiversity if Im on my farm as a manager', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(2);
      getInsight(farm_id, user_id, 'biodiversity', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });

    test('Should get biodiversity if Im on my farm as a worker', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(3);
      getInsight(farm_id, user_id, 'biodiversity', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
  });

  describe('prices distance', () => {
    describe('Unit tests', () => {
      test('Distance between two coordinate test', async (done) => {
        expect(insightHelpers.distance(62.990967, -71.463767, 52.990967, -91.463767) - 1612.09).toBeLessThan(0.5);
        expect(insightHelpers.distance(-62.990967, 171.463767, -52.990967, 191.463767) - 1612.09).toBeLessThan(0.5);
        expect(insightHelpers.distance(62.990967, -71.463767, 62.990967, -71.463767)).toBe(0);
        done();
      });

      test('queryCropSalesNearByStartDateAndFarmId test', async (done) => {
        const startdate = moment().format("YYYY-MM-DD");
        const gridPoint0 = { lat: 62.990967, lng: -71.463767 };
        const gridPoint5West = { lat: 62.990967, lng: -71.553767 };
        const gridPoint10West = { lat: 62.990967, lng: -71.653767 };
        const gridPoint15West = { lat: 62.990967, lng: -71.753767 };
        const gridPoint20West = { lat: 62.990967, lng: -71.853767 };
        const gridPoint25West = { lat: 62.990967, lng: -71.953767 };
        const gridPoint30West = { lat: 62.990967, lng: -72.053767 };
        const gridPoint5East = { lat: 62.990967, lng: -71.373767 };

        const gridPoints = [gridPoint0, gridPoint5West, gridPoint10West, gridPoint15West, gridPoint20West, gridPoint25West, gridPoint30West, gridPoint5East];
        const crops = [];
        for(let i = 0; i < 3; i++){
          const [crop] = await mocks.cropFactory();
          await knex('crop').where({crop_id: crop.crop_id}).update({farm_id: null});
          crop.farm_id = null;
          crops.push(crop);
        }
        const crop0Sales = [];
        const crop1Sales = [];
        const crop2Sales = [];
        // for(const grid_points of gridPoints){
        //   const cropSale = await mocks.cropSaleFactory();
        //   const {field_crop_id} = await knex('cropSale').where({sale_id: cropSale.sale_id}).first();
        //   const {field_id} = await knex('fieldCrop').where({field_crop_id}).first();
        //   const {farm_id} = await knex('field').where({field_id}).first();
        //   await knex('farm').where(farm_id).update({grid_points});
        //
        // }

        const farms = [];
        const fields = []
        for(const grid_points of gridPoints){
          const [farm] = await mocks.farmFactory({...mocks.fakeFarm(), grid_points});
          const [field] = await mocks.fieldFactory({promisedFarm: [farm]});
          const [fieldCrop] = await mocks.fieldCropFactory({promisedCrop: [crops[0]], promisedField: [field]});
          const [cropSale] = await mocks.cropSaleFactory({promisedFieldCrop: [fieldCrop]});
          fields.push(field);
          farms.push(farm);
          crop0Sales.push(cropSale);
        }

        for(let i = 0; i < 2; i++){
          const [fieldCrop1] = await mocks.fieldCropFactory({promisedField: [fields[i]], promisedCrop: [crops[1]]});
          const [crop1Sale] = await mocks.cropSaleFactory({promisedFieldCrop: [fieldCrop1]});
          crop1Sales.push(crop1Sale);
          const [fieldCrop2] = await mocks.fieldCropFactory({promisedField: [fields[i+1]], promisedCrop: [crops[2]]});
          const [crop2Sale] = await mocks.cropSaleFactory({promisedFieldCrop: [fieldCrop2]});
          crop2Sales.push(crop2Sale);
        }

        const getQuery = (distance) => ({
          distance: distance,
          lat: gridPoint0.lat,
          long: gridPoint0.lng,
          startdate,
        })

        const [{user_id, farm_id}] = await mocks.userFarmFactory({promisedFarm: [farms[0]]}, {...mocks.fakeUserFarm(), role_id: 1})
        getInsightWithQuery(farm_id, user_id, 'prices/distance', getQuery(5), (err, res) => {
          console.log(res);
          expect(res.status).toBe(200);
          done();
        });
      });
    });


    test('Should get prices distance if Im on my farm as an owner', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(1);
      query = mocks.fakePriceInsightForTests();

      getInsightWithQuery(farm_id, user_id, 'prices/distance', query, (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
    test('Should get prices distance if Im on my farm as a manager', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(2);
      getInsightWithQuery(farm_id, user_id, 'prices/distance', query, (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });

    test('Should get prices distance if Im on my farm as a worker', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(3);
      getInsightWithQuery(farm_id, user_id, 'prices/distance', query, (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
  });

  describe('waterbalance', () => {
    describe('GET', () => {
      test('Should get waterbalance if Im on my farm as an owner', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(1);
        getInsight(farm_id, user_id, 'waterbalance', (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });
      test('Should get waterbalance if Im on my farm as a manager', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(2);
        getInsight(farm_id, user_id, 'waterbalance', (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });

      test('Should get waterbalance if Im on my farm as a worker', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(3);
        getInsight(farm_id, user_id, 'waterbalance', (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });
    });

    describe('POST', () => {
      test('should create a water balance if Im on my farm as an owner', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(1);
        const [field] = await mocks.fieldFactory({ promisedFarm: [{ farm_id }] });
        const [{ crop_id, field_id }] = await mocks.fieldCropFactory({ promisedField: [field] });
        const waterBalance = { ...mocks.fakeWaterBalance(), crop_id, field_id };
        postWaterBalance(waterBalance, { farm_id, user_id }, (err, res) => {
          expect(res.status).toBe(201);
          done();
        });
      });

      test('should create a water balance if Im on my farm as a manager', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(2);
        const [field] = await mocks.fieldFactory({ promisedFarm: [{ farm_id }] });
        const [{ crop_id, field_id }] = await mocks.fieldCropFactory({ promisedField: [field] });
        const waterBalance = { ...mocks.fakeWaterBalance(), crop_id, field_id };
        postWaterBalance(waterBalance, { farm_id, user_id }, (err, res) => {
          expect(res.status).toBe(201);
          done();
        });
      });

      test('should fail to create  a water balance if Im on my farm as a Worker', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(3);
        const [field] = await mocks.fieldFactory({ promisedFarm: [{ farm_id }] });
        const [{ crop_id, field_id }] = await mocks.fieldCropFactory({ promisedField: [field] });
        const waterBalance = { ...mocks.fakeWaterBalance(), crop_id, field_id };
        postWaterBalance(waterBalance, { farm_id, user_id }, (err, res) => {
          expect(res.status).toBe(403);
          done();
        });
      });


    });
  });

  describe('waterbalance schedule', () => {
    describe('GET', () => {
      test('Should get waterbalance schedule if Im on my farm as an owner', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(1);
        getInsight(farm_id, user_id, 'waterbalance/schedule', (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });
      test('Should get waterbalance schedule if Im on my farm as a manager', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(2);
        getInsight(farm_id, user_id, 'waterbalance/schedule', (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });
      test('Should get waterbalance schedule if Im on my farm as a worker', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(3);
        getInsight(farm_id, user_id, 'waterbalance/schedule', (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });
    });
    describe('POST', () => {
      test('Should register my farm to the water balance schedule as an owner', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(1);
        postWaterBalanceSchedule({ farm_id, user_id }, async (err, res) => {
          expect(res.status).toBe(200);
          const schedule = await knex('waterBalanceSchedule').where({ farm_id }).first();
          expect(schedule.farm_id).toBe(farm_id);
          done();
        });
      });
      test('Should register my farm to the water balance schedule as a manager', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(2);
        postWaterBalanceSchedule({ farm_id, user_id }, async (err, res) => {
          expect(res.status).toBe(200);
          const schedule = await knex('waterBalanceSchedule').where({ farm_id }).first();
          expect(schedule.farm_id).toBe(farm_id);
          done();
        });
      });

      test('Should fail to register my farm to the water balance schedule as a worker', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(3);
        postWaterBalanceSchedule({ farm_id, user_id }, async (err, res) => {
          expect(res.status).toBe(403);
          done();
        });
      });

    });
  });

  describe('nitrogenbalance', () => {
    test('Should get nitrogenbalance if Im on my farm as an owner', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(1);
      getInsight(farm_id, user_id, 'nitrogenbalance', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
    test('Should get nitrogenbalance if Im on my farm as a manager', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(2);
      getInsight(farm_id, user_id, 'nitrogenbalance', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });

    test('Should get nitrogenbalance if Im on my farm as a worker', async (done) => {
      const [{ user_id, farm_id }] = await createUserFarm(3);
      getInsight(farm_id, user_id, 'nitrogenbalance', (err, res) => {
        expect(res.status).toBe(200);
        done();
      });
    });
  });

  describe('nitrogenbalance schedule', () => {
    describe('GET', () => {
      test('Should get nitrogenbalance schedule if Im on my farm as an owner', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(1);
        getInsight(farm_id, user_id, 'nitrogenbalance/schedule', (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });

      test('Should get nitrogenbalance schedule if Im on my farm as a manager', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(2);
        getInsight(farm_id, user_id, 'nitrogenbalance/schedule', (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });

      test('Should get nitrogenbalance schedule if Im on my farm as a worker', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(3);
        getInsight(farm_id, user_id, 'nitrogenbalance/schedule', (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });
    });

    describe('POST', () => {
      test('should create nitrogen balance schedule if Im on my farm as an owner', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(1);
        const nitrogenSchedule = { ...mocks.fakeNitrogenSchedule(), farm_id };
        postNitrogenSchedule(nitrogenSchedule, { farm_id, user_id }, (err, res) => {
          expect(res.status).toBe(201);
          done();
        });
      });

      test('should createnitrogen balance if Im on my farm as a manager', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(2);
        const nitrogenSchedule = { ...mocks.fakeNitrogenSchedule(), farm_id };
        postNitrogenSchedule(nitrogenSchedule, { farm_id, user_id }, (err, res) => {
          expect(res.status).toBe(201);
          done();
        });
      });

      test('should fail to create nitrogen balance if Im on my farm as a Worker', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(3);
        const nitrogenSchedule = { ...mocks.fakeNitrogenSchedule(), farm_id };
        postNitrogenSchedule(nitrogenSchedule, { farm_id, user_id }, (err, res) => {
          expect(res.status).toBe(403);
          done();
        });
      });


    });

    describe('DELETE', () => {
      test('should delete nitrogen balance schedule if Im on my farm as an owner', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(1);
        const [schedule] = await mocks.nitrogenScheduleFactory({ promisedFarm: [{ farm_id }] });
        deleteNitrogenSchedule({ user_id, farm_id }, schedule.nitrogen_schedule_id, (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });

      test('should delete nitrogen balance schedule if Im on my farm as a manager', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(2);
        const [schedule] = await mocks.nitrogenScheduleFactory({ promisedFarm: [{ farm_id }] });
        deleteNitrogenSchedule({ user_id, farm_id }, schedule.nitrogen_schedule_id, (err, res) => {
          expect(res.status).toBe(200);
          done();
        });
      });

      test('should fail to delete nitrogen balance schedule if Im on my farm as a worker', async (done) => {
        const [{ user_id, farm_id }] = await createUserFarm(3);
        const [schedule] = await mocks.nitrogenScheduleFactory({ promisedFarm: [{ farm_id }] });
        deleteNitrogenSchedule({ user_id, farm_id }, schedule.nitrogen_schedule_id, (err, res) => {
          expect(res.status).toBe(403);
          done();
        });
      });
    });
  });

});

function createUserFarm(role) {
  return mocks.userFarmFactory({
    promisedFarm: mocks.farmFactory(),
    promisedUser: mocks.usersFactory(),
  }, { role_id: role, status: 'Active' });
}

function getInsight(farmId, userId, route, callback) {
  chai.request(server).get(`/insight/${route}/${farmId}`)
    .set('farm_id', farmId)
    .set('user_id', userId)
    .end(callback);
}

function getInsightWithQuery(farmId, userId, route, query, callback) {
  chai.request(server).get(`/insight/${route}/${farmId}?distance=${query.distance}&lat=${query.lat}&long=${query.long}&startdate=${query.startdate || '2020-1-1'}`)
    .set('farm_id', farmId)
    .set('user_id', userId)
    .end(callback);
}

function postWaterBalance(data, { farm_id, user_id }, callback) {
  chai.request(server).post(`/insight/waterbalance`)
    .set('farm_id', farm_id)
    .set('user_id', user_id)
    .send(data)
    .end(callback);
}

function postNitrogenSchedule(data, { farm_id, user_id }, callback) {
  chai.request(server).post('/insight/nitrogenbalance/schedule')
    .set('farm_id', farm_id)
    .set('user_id', user_id)
    .send(data)
    .end(callback);
}

function postWaterBalanceSchedule({ farm_id, user_id }, callback) {
  chai.request(server).post(`/insight/waterbalance/schedule`)
    .set('farm_id', farm_id)
    .set('user_id', user_id)
    .send({ farm_id })
    .end(callback);
}

function deleteNitrogenSchedule({ farm_id, user_id }, nitrogenId, callback) {
  chai.request(server).delete(`/insight/nitrogenbalance/schedule/${nitrogenId}`)
    .set('farm_id', farm_id)
    .set('user_id', user_id)
    .end(callback);
}
