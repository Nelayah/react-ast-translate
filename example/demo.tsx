import * as React from 'react';

interface IAppProps {}

const Component: React.FC<IAppProps> = () => {
  return (
    <div className="container">
      Depth-First-Search
      <span>深度优先遍历（Depth-First-Search），是搜索算法的一种，它沿着树的深度遍历树的节点，尽可能深地搜索树的分支。</span>
      <span>当节点v的所有边都已被探寻过，将回溯到发现节点v的那条边的起始节点。</span>
      <span>这一过程一直进行到已探寻源节点到其他所有节点为止，如果还有未被发现的节点，则选择其中一个未被发现的节点为源节点并重复以上操作，直到所有节点都被探寻完成。</span>
    </div>
  );
};
Component.displayName = 'Demo';

export default Component;