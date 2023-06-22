import { stepNames, uiBillFields } from "./data";

function defaultVal(val, defVal){
  if(val === void 0 || val === null || val < defVal){
    return defVal;
  }
  return val;
}

function formatEle(ele){
  let data = {};
  if(!!ele){
    data.id = ele.id;
    data.text = ele.text;
    data.notInRoot = !!ele.notInRoot;
    data.optional = !!ele.optional;
    data.multi = !!ele.multi;
  }
  return data;
}

function formatBroke(broke){
  let data = {};
  if(!!broke){
    data.element = formatEle(broke.element);
    data.activity = broke.activity;
    data.activities = broke.activities || [];
  }
  return data;
}

function formatWhile(step){
  const data = {};
  data.sleepTime = step.sleepTime;
  data.maxCount = defaultVal(step.maxCount, -1);
  data.flows = formatSteps(step.flows);
  data.broke = formatBroke(step.broke);
  return data;
}

function formatBuildIn(step){
  const data = {};
  data.methodName = step.methodName;
  data.argName = step.argName;
  data.argValue = step.argValue;
  data.argType = step.argType;
  return data;
}

function formatCache(step){
  const data = {};
  data.index = defaultVal(step.index, 0);
  data.viewId = step.viewId;
  data.cacheKey = step.cacheKey;
  if(!!step.uiBillFields && step.uiBillFields.length > 0){
    data.uiBillFields = step.uiBillFields.filter(a => uiBillFields.some(b => b.name === a))
  }
  data.element = formatEle(step.element);
  return data;
}

function formatCheck(step){
  const data = {};
  data.activity = step.activity;
  data.optional = !!step.optional;
  data.match = {};
  if(!!step.match){
    data.match.name = step.match.name;
    data.match.flows = formatSteps(step.match.flows);
  }
  data.mismatch = {};
  if(!!step.mismatch){
    data.mismatch.name = step.mismatch.name;
    data.mismatch.flows = formatSteps(step.mismatch.flows);
  }
  return data;
}

function formatClick(){
  const data = {};
  return data;
}

function formatInput(step){
  const data = {};
  data.text = step.text;
  data.randomMax = step.randomMax;
  data.randomMin = step.randomMin;
  data.scale = Math.min(defaultVal(step.scale, 0), 2);
  data.cacheKey = step.cacheKey;
  return data;
}

function formatPressKey(step){
  const data = {};
  data.keyType = step.keyType;
  data.key = defaultVal(step.key, 0);
  return data;
}

function formatRecycleView(step){
  const data = {};
  data.numberPerPage = defaultVal(step.numberPerPage, 0);
  data.rangeBegin = defaultVal(step.indexType === 'range' ? step.rangeBegin : null, -1);
  data.rangeEnd = defaultVal(step.indexType === 'range' ? step.rangeEnd : null, -1);
  data.random = step.indexType === 'random';
  data.randomCount = defaultVal(!!data.random ? step.randomCount : null, 0);
  if(step.indexType === 'index' && !!step.indexes && step.indexes.length > 0){
    data.indexes = step.indexes.filter(a => a >= 0);
  }
  data.childViewId = step.childViewId;
  data.flows = formatSteps(step.flows);

  // 以下字段不传递到pos侧
  data.indexType = step.indexType;
  return data;
}

function formatSleep(step){
  const data = {};
  data.sleep = defaultVal(step.sleep, 0);
  return data;
}

function formatSwipe(step){
  const data = {};
  data.direction = step.direction;
  return data;
}

function formatWait(step){
  const data = {};
  data.time = defaultVal(step.time, 1);
  data.maxTime = defaultVal(step.maxTime, 60);
  data.flows = formatSteps(step.flows);
  data.broke = formatBroke(step.broke);
  return data;
}

export function formatStepData(step){
  let data;
  switch(step.perform){
    case 'while': data = formatWhile(step); break;
    case 'buildIn': data = formatBuildIn(step); break;
    case 'cache': data = formatCache(step); break;
    case 'check': data = formatCheck(step); break;
    case 'click': data = formatClick(step); break;
    case 'input': data = formatInput(step); break;
    case 'pressKey': data = formatPressKey(step); break;
    case 'recycleView': data = formatRecycleView(step); break;
    case 'sleep': data = formatSleep(step); break;
    case 'swipe': data = formatSwipe(step); break;
    case 'wait': data = formatWait(step); break;
  }
  if(!!data){
    data.perform = step.perform;
    const tmpStep = stepNames.filter(a => a.name === data.perform)[0];
    if(!!tmpStep && !!tmpStep.showEle){
      data.element = formatEle(step.element);
    }
    data._id = step._id;
    data.name = step.name;
    data.description = step.description;
  }
  return data;
}

export function formatSteps(steps){
  if(!steps || steps.length === 0) return [];
  return steps.filter(a => !!a).map(a => formatStepData(a));
}