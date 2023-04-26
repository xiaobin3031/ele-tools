import { flows } from "./flowData";

let globalId = 1;
const createFlow = (prefix, otherValues = {}) => {
  const flow = {...otherValues};
  flow._id = `${prefix}-${globalId++}`
  flow._id_prefix = prefix;
  if(!!flow.perform){
    initFlow(flow);
  }
  return flow;
}
const initFlow = (flow) => {
  if(!!flow._init){
    return;
  }
  if(!!flow.perform){
    switch(flow.perform){
      case 'while': initWhile(flow); break;
      case 'buildIn': initBuildIn(flow); break;
      case 'cache': initCache(flow); break;
      case 'check': initCheck(flow); break;
      case 'click': initClick(flow); break;
      case 'input': initInput(flow); break;
      case 'pressKey': initPressKey(flow); break;
      case 'recycleView': initRecycleView(flow); break;
      case 'sleep': initSleep(flow); break;
      case 'swipe': initSwipe(flow); break;
      case 'wait': initWait(flow); break;
      default: break;
    }
    flow.name = '';
    if(flows.filter(a => a.name === flow.perform)[0].showEle){
      flow.element = initElement();
    }
    flow.description = '';
    flow._init = true;
  }
}
const initBroke = () => {
  return {
    _id: `broke-${globalId++}`,
    element: initElement(),
    activity: '',
    activities: []
  } 
}
const initElement = () => {
  return {
    _id: `element-${globalId++}`,
    id: '',
    text: '',
    notInRoot: false,
    optional: false,
    multi: false,
    anyElements: [ ]
  }
}
const initSingleElement = () => {
  return {
    _id: `element-${globalId++}`,
    id: '',
    text: '',
    notInRoot: false,
    optional: false,
    multi: false
  }
}
const initBuildIn = (flow) => {
  flow.methodName = '';
  flow.argName = '';
  flow.argValue = '';
  flow.argType = '';
  return flow;
}
const initCache = (flow) => {
  flow.index = 0;
  flow.viewId = '';
  flow.cacheKey = '';
  flow.uiBillField = [];
  return flow;
}
const initCheck = (flow) => {
  flow.activity = '';
  flow.optional = false;
  flow.match = initMatch({});
  flow.mismatch = initMismatch({});
  return flow;
}
const initMatch = (match) => {
  match._id = `check-match-${globalId++}`
  match.name = ''
  match.flows = []
  return match;
}
const initMismatch = (mismatch) => {
  mismatch._id = `check-mismatch-${globalId++}`
  mismatch.name = ''
  mismatch.flows = []
  return mismatch;
}
const initClick = (flow) => {
  return flow;
}
const initInput = (flow) => {
  flow.text = '';
  flow.randomMax = '';
  flow.randomMin = '';
  flow.scale = 0;
  flow.cacheKey = '';
  return flow;
}
const initPressKey = (flow) => {
  flow.keyType = '';
  flow.key = 0;
  return flow;
}
const initRecycleView = (flow) => {
  flow.numberPerPage = 0;
  flow.rangeBegin = -1;
  flow.rangeEnd = -1;
  flow.random = false;
  flow.randomCount = 0;
  flow.indexes = [];
  flow.childViewId = '';
  flow.flows = [];
  return flow;
}
const initSleep = (flow) => {
  flow.sleep = 0;
  return flow;
}
const initSwipe = (flow) => {
  flow.direction = '';
  return flow;
}
const initWait = (flow) => {
  flow.time = 1;
  flow.maxTime = 60;
  flow.flows = [];
  return flow;
}
const initWhile = (flow) => {
  flow.sleepTime = 0;
  flow.maxCount = -1;
  flow.flows = [];
  return flow;
}

export {initFlow, initBroke, initBuildIn, initCache, initClick, 
  initElement, initInput, initPressKey, initRecycleView, 
  initSleep, initSwipe, initWait, initWhile, initSingleElement, initMatch, initMismatch, createFlow}