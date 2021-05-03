'use strict';

var runTimeA, memoryA, runTimeB, memoryB, benchmarkA, benchmarkB, active, errorA, errorB, hasError;

var init = function() {
    // set up elements
    runTimeA = document.getElementById('inputARunTime');
    memoryA = document.getElementById('inputAMemory');
    runTimeB = document.getElementById('inputBRunTime');
    memoryB = document.getElementById('inputBMemory');
    benchmarkA = document.getElementById('benchmarkA');
    benchmarkB = document.getElementById('benchmarkB');
    errorA = document.getElementById('errorA');
    errorB = document.getElementById('errorB');
    // set up events
    window.onerror = function(event) {
        hasError = true;
        errorHandling(event);
    }
}

init();

var gatherCode = function(inputId) {
    return minify(document.getElementById(inputId).value);
}

var minify = function(codeStr) {
    return codeStr.trim().replace(/\s\s+/g, ' ');
}

var getTimeNow = function() {
    return Date.now(); // return in milliseconds
}

var getMemory = function() {
    if (!window.performance) return NaN;
    return window.performance.memory.usedJSHeapSize  // return in Bytes
}

var removeCodeById = function(id) {
    document.getElementById(id) ? document.getElementById(id).remove() : undefined;
}

var runCode = function(id, snippet) {
    removeCodeById(id);
    var code;
    code = document.createElement('script');
    code.id = id;
    code.text = snippet;
    document.body.appendChild(code);
}

var run = function(id) {
    hasError = false;
    var code = gatherCode(id);
    if (!code || code === '') return;
    setActive(id);
    var preRunTime = getTimeNow();
    var preRunMem = getMemory();
    runCode('run-' + id, code);
    var postRunTime = getTimeNow();
    var postRunMem = getMemory();
    if (hasError) return;
    updateResult(id, {
        runTime: postRunTime - preRunTime,
        memory: postRunMem - preRunMem
    });
}

var setActive = function(id) {
   active = id;
}

var updateResult = function(id, result) {
    if (id === 'codeA') {
        errorA.style.display = 'none';
        runTimeA.innerHTML = result.runTime + ' milliseconds';
        memoryA.innerHTML = result.memory + ' bytes';
        benchmarkA.style.display = 'inline-block';
    }
    if (id === 'codeB') {
        errorB.style.display = 'none';
        runTimeB.innerHTML = result.runTime + ' milliseconds';
        memoryB.innerHTML = result.memory + ' bytes';
        benchmarkB.style.display = 'inline-block';
    }
}

var errorHandling = function(events) {
    if (active === 'codeA') {
        benchmarkA.style.display = 'none';
        errorA.innerHTML = events;
        errorA.style.display = 'inline-block';
    }
    if (active === 'codeB') {
        benchmarkB.style.display = 'none';
        errorB.innerHTML = events;
        errorB.style.display = 'inline-block';
    }
}
