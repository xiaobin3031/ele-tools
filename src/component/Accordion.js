import React, { useRef, useState } from 'react';
import '../css/accordion.css'
import Icon from './Icon';

let accordionGlobalId = 1;

function collsaping($dom){
  setAnimation(getHeaderIconDom($dom), 'x-accordion-header-close')
  $dom.classList.remove('expand');
  $dom.classList.add('collsaping');
}

function exapnding($dom){
  setAnimation(getHeaderIconDom($dom), 'x-accordion-header-open')
  $dom.classList.remove('collsape');
  $dom.classList.add('expanding');
}

function getHeaderIconDom($dom){
  const _children = $dom.children[0].children;
  for(let i = 0;i<_children.length;i++){
    if(_children[i].classList.contains('icon')){
      return _children[i].firstChild;
    }
  }
  return null;
}

function setAnimation($dom, name){
  if(!$dom) return;
  $dom.style.animation = `${name} .3s ease`
  $dom.style.animationFillMode = 'forwards'
}

function contentTransitionEnd($dom){
  if($dom.classList.contains('expanding')){
    $dom.classList.remove('expanding');
    $dom.classList.add('expand');
  }else if($dom.classList.contains('collsaping')){
    $dom.classList.remove('collsaping');
    $dom.classList.add('collsape');
  }
}

function AccordionHeader({title="Accortion Item", subTitle, isOpen}){

  let icon;

  if(isOpen){
    icon = <Icon iconType="up" />
  }else{
    icon = <Icon iconType="down" />
  }

  return (
    <>
      <span className='title'>{title}</span>
      {
        !!subTitle && <span className='sub-title'>{subTitle}</span>
      }
      <span className='icon'>{icon}</span>
    </>
  )
}

function AccordionContent({content}){

  return (
    <div style={{
      padding: "8px 12px"
    }}>
      {content}
    </div>
  )
}

function AccordionItem({title, subTitle, content, open, item, index, renderHeader, renderContent, collsapeOther}){

  const opens = useRef(!!item[open]);
  const _itemRef = useRef(null);

  function changeOpenState(){
    const $dom = _itemRef.current;
    if($dom.classList.contains('collsape')){
      exapnding(_itemRef.current);
      opens.current = true;
    }else if($dom.classList.contains('expand')){
      collsaping(_itemRef.current);
      opens.current = false;
    }
    if(!!collsapeOther){
      collsapeOther(index, opens.current);
    }
  }

  return (
    <div className={`item${opens.current ? ' expand' : ' collsape'}`} ref={_itemRef}>
      <div className='header' onClick={changeOpenState}>
        {!!renderHeader ? renderHeader(item, index) : <AccordionHeader title={item[title]} subTitle={item[subTitle]} isOpen={opens.current}/>}
      </div>
      <div className='content' onTransitionEnd={event => contentTransitionEnd(event.target.parentNode)}>
        {!!renderContent ? renderContent(item, index) : <AccordionContent content={item[content]}/>}
      </div>
    </div>
  )
}

export function Accordion({
  list, 
  key = "_key", 
  title = "_title",
  subTitle = "_subTitle",
  content = "_content",
  open = "_open",
  openOne,
  renderHeader,
  renderContent,
  ...props}){

  const _accrodionRef = useRef(null);

  function getItemKey(item){
    let _key = item[key];
    if(!_key){
      _key = `accortion-item-${accordionGlobalId++}`
    }
    return _key;
  }

  function collsapeOther(index, open){
    if(!open){
      return;
    }
    if(openOne){
      const itemChildren = _accrodionRef.current.children;
      for(let i=0;i<itemChildren.length;i++){
        if(i === index){
          continue;
        }
        const itemChild = itemChildren[i];
        if(itemChild.classList.contains('expand')){
          collsaping(itemChild);
        }
      }
    }
  }

  return (
    <div className="x-accordion" {...props} ref={_accrodionRef}>
      {
        !!list && list.length > 0 &&
        list.map((a, index) => {
          return (
            <AccordionItem key={getItemKey(a)}
              item={a}
              title={title}
              subTitle={subTitle}
              content={content}
              open={open}
              index={index}
              openOne
              collsapeOther={collsapeOther}
              renderContent={renderContent}
              renderHeader={renderHeader}
            />
          )
        })
      }
    </div>
  )
}