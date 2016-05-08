export default function makePromiseFromNode(toPromisify) {
  return function nodeMethodReturningPromise(...methodArgs) {
    return new Promise(function returnedPromise(resolve, reject) {
      const newCallback = function(error, ...callbackArgs) {
        if(error) { reject.apply(null, [error].concat(callbackArgs)); }
        else { resolve.apply(null, callbackArgs); }
      };

      toPromisify.apply(null, methodArgs.concat(newCallback));
    });

  };
}
