import Api from '@api-platform/api-doc-parser/lib/Api';
import Field from '@api-platform/api-doc-parser/lib/Field';
import Resource from '@api-platform/api-doc-parser/lib/Resource';
import {TextInput} from 'admin-on-rest';
import {shallow} from 'enzyme';
import React from 'react';
import Edit from './Edit';
import inputFactory from './inputFactory';

const entrypoint = 'http://entrypoint';

const apiData = {
  entrypoint,
};

const resourceData = {
  name: 'user',
  url: `${entrypoint}/users`,
  writableFields: [
    new Field('fieldA', {
      id: 'http://schema.org/fieldA',
      range: 'http://www.w3.org/2001/XMLSchema#string',
      reference: null,
      required: true,
    }),
    new Field('fieldB', {
      id: 'http://schema.org/fieldB',
      range: 'http://www.w3.org/2001/XMLSchema#string',
      reference: null,
      required: true,
    }),
    new Field('deprecatedField', {
      id: 'http://localhost/deprecatedField',
      range: 'http://www.w3.org/2001/XMLSchema#string',
      reference: null,
      required: true,
      deprecated: true,
    }),
  ],
};

describe('<Edit />', () => {
  test('without overrides', () => {
    const defaultInputFactory = jest.fn(inputFactory);

    const resource = new Resource(
      resourceData.name,
      resourceData.url,
      resourceData,
    );

    const api = new Api(apiData.entrypoint, {
      ...apiData,
      resources: [resource],
    });

    const render = shallow(
      <Edit
        options={{
          api,
          inputFactory: defaultInputFactory,
          resource,
        }}
      />,
    );

    expect(defaultInputFactory).toHaveBeenCalledTimes(2);
    expect(render.find(TextInput).length).toEqual(2);
    expect(render.find(TextInput).get(0).props.source).toEqual('fieldA');
    expect(render.find(TextInput).get(1).props.source).toEqual('fieldB');
  });

  test('with custom inputFactory', () => {
    const customInputFactory = jest.fn(inputFactory);
    const defaultInputFactory = jest.fn(inputFactory);

    const resource = new Resource(resourceData.name, resourceData.url, {
      ...resourceData,
      editProps: {
        options: {
          inputFactory: customInputFactory,
        },
      },
    });

    const api = new Api(apiData.entrypoint, {
      ...apiData,
      resources: [resource],
    });

    const render = shallow(
      <Edit
        options={{
          api,
          inputFactory: defaultInputFactory,
          resource,
        }}
      />,
    );

    expect(customInputFactory).toHaveBeenCalledTimes(2);
    expect(defaultInputFactory).toHaveBeenCalledTimes(0);
    expect(render.find(TextInput).length).toEqual(2);
    expect(render.find(TextInput).get(0).props.source).toEqual('fieldA');
    expect(render.find(TextInput).get(1).props.source).toEqual('fieldB');
  });

  test('with custom fields', () => {
    const defaultInputFactory = jest.fn(inputFactory);

    const resource = new Resource(resourceData.name, resourceData.url, {
      ...resourceData,
      editFields: [
        new Field('fieldC', {
          id: 'http://schema.org/fieldC',
          range: 'http://www.w3.org/2001/XMLSchema#string',
          reference: null,
          required: true,
        }),
      ],
    });

    const api = new Api(apiData.entrypoint, {
      ...apiData,
      resources: [resource],
    });

    const render = shallow(
      <Edit
        options={{
          api,
          inputFactory: defaultInputFactory,
          resource,
        }}
      />,
    );

    expect(defaultInputFactory).toHaveBeenCalledTimes(1);
    expect(render.find(TextInput).length).toEqual(1);
    expect(render.find(TextInput).get(0).props.source).toEqual('fieldC');
  });
});