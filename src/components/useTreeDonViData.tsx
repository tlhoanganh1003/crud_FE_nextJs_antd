/* eslint-disable @typescript-eslint/no-explicit-any */
import { donVi } from "@/data/donVi";
import { TreeSelect } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export interface TreeNode {
  title: string;
  value: number;
  key: number;
  isLeaf?: boolean;
  children?: TreeNode[];
}

function buildTree(data: donVi[]): TreeNode[] {
  const idSet = new Set(data.map(d => d.don_vi_id));

  // Các node không có cha hợp lệ được xem là node gốc
  const rootNodes = data.filter(
    item => item.don_vi_cha_id === null || !idSet.has(item.don_vi_cha_id!)
  );

  const buildChildren = (parentId: number): TreeNode[] => {
    const children = data.filter(item => item.don_vi_cha_id === parentId);
    return children.map(child => {
      const hasChildren = data.some(item => item.don_vi_cha_id === child.don_vi_id);
      return {
        title: child.ten_don_vi,
        value: child.don_vi_id,
        key: child.don_vi_id,
        children: hasChildren ? buildChildren(child.don_vi_id) : undefined,
        isLeaf: !hasChildren,
      };
    });
  };

  return rootNodes.map(root => {
    const hasChildren = data.some(item => item.don_vi_cha_id === root.don_vi_id);
    return {
      title: root.ten_don_vi,
      value: root.don_vi_id,
      key: root.don_vi_id,
      children: hasChildren ? buildChildren(root.don_vi_id) : undefined,
      isLeaf: !hasChildren,
    };
  });
}




export function useTreeData() {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    loadNodeRoot()
  }, []);

  const loadNodeRoot = async () => {
   await axios.get("http://localhost:5015/api/donVi/allByDon_vi_cha_id")
      .then((response) => {
        const data = response.data;
        const rootNodes = data.map((item: { ten_don_vi: any; don_vi_id: any; isLeaf: any }) => ({
          title: item.ten_don_vi,
          value: item.don_vi_id,
          key: item.don_vi_id,
          isLeaf: !item.isLeaf,
        }));
        setTreeData(rootNodes);
      })
      .catch((error) => {
        console.error("Error fetching root nodes:", error);
      });

  }



  const onLoadData = async (treeNode: any): Promise<void> => {
    if (treeNode.children) return;

    try {
      const res = await axios.get(
        `http://localhost:5015/api/donVi/allByDon_vi_cha_id`,
        { params: { don_vi_cha_id: treeNode.key } }
      );

      const children = res.data;

      const newChildren = children.map((item: any) => ({
        title: item.ten_don_vi,
        value: item.don_vi_id,
        key: item.don_vi_id,
        isLeaf: !item.isLeaf,
      }));

      const updateTree = (nodes: TreeNode[]): TreeNode[] =>
        nodes.map((node) => {
          if (node.key === treeNode.key) {
            return { ...node, children: newChildren };
          }
          if (node.children) {
            return { ...node, children: updateTree(node.children) };
          }
          return node;
        });

      setTreeData((prev) => updateTree(prev));
    } catch (error) {
      console.error("Error loading child nodes:", error);
    }
  };



  const handleSearch = async (value: string) => {
    if (!value) loadNodeRoot();

    try {
      const res = await axios.get("http://localhost:5015/api/donVi/search", {
        params: { query: value },
      });
      const data = res.data
      console.log(data)
      setTreeData(buildTree(data))
    } catch (error) {
      console.error("Error during search:", error);
    }
  };


  return { treeData, setTreeData, onLoadData, handleSearch };
}


export default function TreeDonVi() {
  const [value, setValue] = useState<number | undefined>(undefined);
  const { treeData, onLoadData, handleSearch } = useTreeData();

  return (
    <>
      <TreeSelect
        style={{ width: '100%' }}
        placeholder="Chọn đơn vị"
        value={value}
        filterTreeNode={false}
        onChange={(val) => setValue(val)}
        treeData={treeData}
        loadData={onLoadData}
        allowClear
        treeDefaultExpandAll={false}
        showSearch
        onSearch={handleSearch}
      />

    </>

  );
}