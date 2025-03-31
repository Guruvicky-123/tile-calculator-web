import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font
  } from '@react-pdf/renderer';
  
  // Use a public font (Noto Sans JP)
  Font.register({
    family: 'NotoJP',
    src: 'https://raw.githubusercontent.com/googlefonts/noto-cjk/main/Sans/TTF/Japanese/NotoSansJP-Regular.ttf',
  });
  
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'NotoJP',
      fontSize: 12,
    },
    title: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
    },
    section: {
      marginBottom: 12,
    },
    bold: {
      fontWeight: 'bold',
    }
  });
  
  interface Props {
    tileSize: { width: string, height: string };
    result: any;
  }
  
  export const PDFReport = ({ tileSize, result }: Props) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>外壁タイル浮き検査レポート</Text>
  
        <View style={styles.section}>
          <Text>タイル寸法: {tileSize.width} cm × {tileSize.height} cm</Text>
        </View>
  
        {Object.entries(result.wallResults).map(([key, res]: any) => (
          <View key={key} style={styles.section}>
            <Text style={styles.bold}>【{key.toUpperCase()}】</Text>
            <Text>浮き枚数: {res.tiles} 枚</Text>
            <Text>浮き面積: {res.covered.toFixed(2)} m²</Text>
            <Text>壁面積: {res.wallArea.toFixed(2)} m²</Text>
            <Text>浮き率: {res.percent.toFixed(2)}%</Text>
          </View>
        ))}
  
        <View style={styles.section}>
          <Text>────────────────────────────</Text>
          <Text>合計浮き面積: {result.totalCovered.toFixed(2)} m²</Text>
          <Text>合計壁面積: {result.totalWall.toFixed(2)} m²</Text>
          <Text>全体の浮き率: {result.totalPercent.toFixed(2)}%</Text>
        </View>
      </Page>
    </Document>
  );
  