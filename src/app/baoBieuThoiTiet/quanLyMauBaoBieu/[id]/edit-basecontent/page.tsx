import SuaBaseBaoBieuPage from "./component/SuaBaseBaoBieuPage";


export default function Page({ params }: { params: { id: string } }) {
  return <SuaBaseBaoBieuPage baseBaoBieuId={params.id} />;
}