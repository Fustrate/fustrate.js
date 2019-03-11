import $ from 'jquery';
import moment from 'moment';

import BasicObject from './basic_object';

class Record extends BasicObject {
  // static get classname() { return 'Subreddit::GameThread'; }
  
  get classname() { return this.constructor.classname; }

  constructor(data) {
    super(data);

    this.isLoaded = false;

    if (typeof data === 'number' || typeof data === 'string') {
      // If the parameter was a number or string, it's likely the record ID
      this.id = parseInt(data, 10);
    } else {
      // Otherwise we were probably given a hash of attributes
      this.extractFromData(data);
    }
  }

  reload({ force } = {}) {
    if (this.isLoaded && !force) {
      return $.when();
    }

    return $.get(this.path({ format: 'json' })).done((response) => {
      this.extractFromData(response);

      this.isLoaded = true;
    });
  }

  update(attributes = {}) {
    let url;

    if (this.id) {
      url = this.path({ format: 'json' });
    } else {
      this.extractFromData(attributes);

      url = this.constructor.createPath({ format: 'json' });
    }

    if (this.community && attributes.community_id === undefined) {
      attributes.community_id = this.community.id;
    }

    return $.ajax({
      url,
      data: this.constructor.toFormData(new FormData(), attributes, this.constructor.paramKey()),
      processData: false,
      contentType: false,
      method: this.id ? 'PATCH' : 'POST',
      xhr: () => {
        const xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = e => this.trigger('upload_progress', e);
        return xhr;
      },
    }).done(this.extractFromData.bind(this));
  }

  delete() {
    return $.ajax(this.path({ format: 'json' }), { method: 'DELETE' });
  }

  static toFormData(data, object, namespace) {
    Object.getOwnPropertyNames(object).forEach((field) => {
      if (typeof object[field] === 'undefined' || Number.isNaN(object[field])) {
        return;
      }

      const key = namespace ? `${namespace}[${field}]` : field;

      if (object[field] && typeof object[field] === 'object') {
        this.appendObjectToFormData(data, key, object[field]);
      } else if (typeof object[field] === 'boolean') {
        data.append(key, Number(object[field]));
      } else if (object[field] !== null && object[field] !== undefined) {
        data.append(key, object[field]);
      }
    });

    return data;
  }

  static appendObjectToFormData(data, key, value) {
    if (value instanceof Array) {
      value.forEach((item) => {
        data.append(`${key}[]`, item);
      });
    } else if (value instanceof File) {
      data.append(key, value);
    } else if (moment.isMoment(value)) {
      data.append(key, value.format());
    } else if (!(value instanceof Record)) {
      this.toFormData(data, value, key);
    }
  }

  static paramKey() {
    return this.classname.underscore().replace('/', '_');
  }

  static create(attributes) {
    const record = new this();

    return $.Deferred((deferred) => {
      record.update(attributes)
        .fail(deferred.reject)
        .done(() => { deferred.resolve(record); });
    });
  }
}

export default Record;
