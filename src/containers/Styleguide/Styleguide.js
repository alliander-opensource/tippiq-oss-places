/**
 * Home container.
 * @module components/Home
 */

import React from 'react';
import Helmet from 'react-helmet';
import { Panel, Button } from 'react-bootstrap';
import { Field, Spinner, Residents as ResidentsComponent } from '../../components';

/**
 * Styleguide component.
 * @function Styleguide
 * @returns {string} Markup of the styleguide page.
 */
const Styleguide = () =>
  <div id="page-styleguide">
    <Helmet title="Styleguide" />
    <div className="container">
      <h1>Heading <mark>1</mark></h1>
      <p>This is a paragraph with a <a href="/">link</a>.</p>
      <Panel header="Panel heading">
        <Field field={{ name: 'field1' }} type="text" placeholder="Text field" />
        <Field field={{ name: 'field2' }} type="password" placeholder="Password field" />
        <Field
          field={{ name: 'field3', touched: true, error: 'Some error' }}
          type="text"
          placeholder="Field with error"
        />
        <div className="form-group">
          <Button bsStyle="primary" block>Button</Button>
        </div>
        <ul className="list-links">
          <li><a href="/">Link 1</a></li>
          <li><a href="/">Link 2</a></li>
        </ul>
        <p className="text-center"><a href="/">Centered link</a></p>
      </Panel>

      <div className="panel panel-default borderless">
        <ul className="list-group">
          <li className="list-group-item header">
            <a className="btn btn-default pull-right" href="http://www.google.com">Wijzigen</a>
            <h2>Huisregels</h2>
          </li>
          <li className="list-group-item checked">
            Ik geef toestemming dat Energy Zero mijn huisregels mag uitlezen
          </li>
        </ul>
      </div>

      <div className="panel panel-default borderless">
        <ul className="list-group">
          <li className="list-group-item">
            <div className="checkbox">
              <label htmlFor="x">
                <input type="checkbox" />
                3P mag mijn slimme meter uitlezen zolang ik klant ben, zodat zij
                energielevering kunnen garanderen en mij kunnen helpen met energiebesparing.
                <mark>*</mark>
              </label>
            </div>
          </li>
          <li className="list-group-item collapse-header">
            Meer over deze regel
          </li>
          <li className="list-group-item">
            <div className="checkbox">
              <label htmlFor="y">
                <input type="checkbox" checked="checked" />
                3P mag mijn slimme meter uitlezen zolang ik klant ben, zodat zij
                energielevering kunnen garanderen en mij kunnen helpen met energiebesparing.
                <mark>*</mark>
              </label>
            </div>
          </li>
          <li className="list-group-item collapse-header in">
            <i className="fa fa-times" aria-hidden="true" /> Minder weergeven
          </li>
          <li className="list-group-item collapse-body">
            De community bestaat uit klanten van 3P bij jou in de buurt. Zij wonen vaak in
            een vergelijkbaar huis. Hierdoor zijn zij een goed ijkpunt om jouw energieverbruik mee
            te vergelijken. Individueel energyverbruik is nooit zichtbaar voor de community. Dit
            is altijd een gemiddeld verbruik van meerdere leden.
          </li>
          <li className="list-group-item has-error">
            <div className="form-group">
              <div className="checkbox">
                <label htmlFor="z">
                  <input type="checkbox" />
                  3P mag mijn slimme meter uitlezen zolang ik klant ben, zodat zij
                  energielevering kunnen garanderen en mij kunnen helpen met energiebesparing.
                  <mark>*</mark>
                </label>
              </div>
              <div className="text-danger">
                Deze huisregel is verplicht
              </div>
            </div>
          </li>
        </ul>
        <br />
        <br />

        <div className="panel-footer borderless">
          <p className="discreet">
            Huisregels met een
            <mark>*</mark>
            moeten worden aangevinkt om gebruik te kunnen maken
            van de diensten van provider X.
          </p>
        </div>
      </div>

      <Button>Default button</Button>

      <p>Spinner: <Spinner /></p>
      <ResidentsComponent
        items={{
          list: [{
            id: 'e5edc3f7-1c85-4551-89a4-8287372d3bb9',
            tippiqId: '5146e98f-8cda-4f5d-8648-601eb5de8dae',
            role: 'place_admin',
          }, {
            id: 'e5edc3f7-1c85-4551-89a4-8287372d3bb9',
            tippiqId: '5146e98f-8cda-4f5d-8648-601eb5de8dae',
            role: 'place_admin',
          }, {
            id: 'e5edc3f7-1c85-4551-89a4-8287372d3bb9',
            tippiqId: '5146e98f-8cda-4f5d-8648-601eb5de8dae',
            role: 'place_admin',
          }, {
            id: 'e5edc3f7-1c85-4551-89a4-8287372d3bb9',
            tippiqId: '5146e98f-8cda-4f5d-8648-601eb5de8dae',
            role: 'place_admin',
          }, {
            id: 'e5edc3f7-1c85-4551-89a4-8287372d3bb9',
            tippiqId: '5146e98f-8cda-4f5d-8648-601eb5de8dae',
            role: 'place_admin',
          }],
        }}
      />
    </div>
  </div>;

export default Styleguide;
