var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ERR_DELETED = 'Query was deleted before result was available';
var ERR_CANCEL = 'Query was canceled before result was available';

var noop = function noop(x) {
  return x;
};

var QueryManager = /*#__PURE__*/function () {

  /**
   * Internal class that helps "asynchronous WebGL query objects" manage
   * pending requests (e.g. for EXT_disjoint_timer_query and WebGL2 queries)
   *
   * Creates and manages promises for the queries.
   * Tracks pending queries enabling polling.
   * Tracks pending queries enabling invalidation.
   * Encapsulates some standard error messages.
   *
   * Remarks:
   * - Maintains a minimal list of pending queries only to minimize GC impact
   * - Exported as a singleton class instance.
   */
  function QueryManager() {
    _classCallCheck(this, QueryManager);

    this.pendingQueries = new Set();
    this.invalidQueryType = null;
    this.invalidErrorMessage = '';
    this.checkInvalid = function () {
      return false;
    };
  }

  // API THAT SHOULD BE EXPOSED TO APPLICATION

  // Checks invalidation callback and then all pending queries for completion
  // Should only be called once per tick


  _createClass(QueryManager, [{
    key: 'poll',
    value: function poll(gl) {
      this.cancelInvalidQueries(gl);

      // Now check availability of results and resolve promises as appropriate
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.pendingQueries.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var query = _step.value;

          var resultAvailable = query.isResultAvailable();
          if (resultAvailable) {
            var result = query.getResult();
            this.resolveQuery(query, result);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    // API FOR MANAGED QUERY CLASSES

    // Registers query invalidation method - used to detect disjoint timer queries

  }, {
    key: 'setInvalidator',
    value: function setInvalidator(_ref) {
      var queryType = _ref.queryType,
          errorMessage = _ref.errorMessage,
          checkInvalid = _ref.checkInvalid;

      this.invalidQueryType = queryType;
      this.invalidErrorMessage = errorMessage;
      this.checkInvalid = checkInvalid;
    }

    // Starts a query, sets up a new promise

  }, {
    key: 'beginQuery',
    value: function beginQuery(query) {
      var onComplete = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

      // Make sure disjoint state is cleared, so that this query starts fresh
      // Cancel other queries if needed
      this.cancelInvalidQueries(query.gl);

      // Cancel current promise - noop if already resolved or rejected
      this.cancelQuery(query);

      // Create a new promise with attached resolve and reject methods
      var resolvers = {};
      query.promise = new Promise(function (resolve, reject) {
        resolvers.resolve = resolve;
        resolvers.reject = reject;
      });
      Object.assign(query.promise, resolvers);

      // Add this query to the pending queries
      this.pendingQueries.add(query);
      // Register the callbacks
      return query.promise.then(onComplete).catch(onError);
    }

    // Resolves a query with a result

  }, {
    key: 'resolveQuery',
    value: function resolveQuery(query, result) {
      this.pendingQueries.delete(query);
      query.promise.resolve(result);
    }

    // Rejects the promise

  }, {
    key: 'rejectQuery',
    value: function rejectQuery(query, errorMessage) {
      this.pendingQueries.delete(query);
      if (query.promise) {
        query.promise.reject(new Error(errorMessage));
      }
    }

    // Rejects promise with standard message for Query.delete()

  }, {
    key: 'deleteQuery',
    value: function deleteQuery(query) {
      return this.rejectQuery(query, ERR_DELETED);
    }

    // Rejects promise with standard message for Query.cancel()

  }, {
    key: 'cancelQuery',
    value: function cancelQuery(query) {
      return this.rejectQuery(query, ERR_CANCEL);
    }

    // Rejects promise with registered message for invalidation

  }, {
    key: 'invalidateQuery',
    value: function invalidateQuery(query) {
      if (query instanceof this.invalidQueryType) {
        this.rejectQuery(query, this.invalidErrorMessage);
      }
    }

    // Checks all queries to see if need to be invalidated

  }, {
    key: 'cancelInvalidQueries',
    value: function cancelInvalidQueries(gl) {
      // We assume that we can cancel queries for all context.
      // Should be OK since this is used to check for "disjoint" GPU state
      if (this.checkInvalid(gl)) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.pendingQueries.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var query = _step2.value;

            this.invalidateQuery(query);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }
  }]);

  return QueryManager;
}();

export default new QueryManager();
//# sourceMappingURL=query-manager.js.map