import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface Question {
  id: number;
  question: string;
  options: { value: number; text: string }[];
  category: 'E-I' | 'S-N' | 'T-F' | 'J-P';
}

const questions: Question[] = [
  {
    id: 1,
    question: 'パーティーや集まりでは、どのような行動を取りますか？',
    options: [
      { value: 1, text: '新しい人に積極的に話しかける' },
      { value: 2, text: 'なるべく多くの人と会話する' },
      { value: 3, text: '知っている人とだけ話す' },
      { value: 4, text: '静かな場所で少数の人と深い話をする' },
      { value: 5, text: 'なるべく早く帰りたいと思う' },
    ],
    category: 'E-I',
  },
  {
    id: 2,
    question: '新しいアイデアを思いついた時、あなたは？',
    options: [
      { value: 1, text: 'すぐに実行に移したくなる' },
      { value: 2, text: '誰かに話して意見を聞きたくなる' },
      { value: 3, text: 'まず情報収集をする' },
      { value: 4, text: 'じっくり一人で考える' },
      { value: 5, text: '完璧に練ってから行動する' },
    ],
    category: 'E-I',
  },
  {
    id: 3,
    question: '問題を解決する時、最初に何をしますか？',
    options: [
      { value: 1, text: '具体的な事実やデータを集める' },
      { value: 2, text: '過去の経験から似たケースを探す' },
      { value: 3, text: '現実的で実用的な解決策を考える' },
      { value: 4, text: '可能性や新しいアプローチを模索する' },
      { value: 5, text: '直感的に解決の方向性を見つける' },
    ],
    category: 'S-N',
  },
  {
    id: 4,
    question: 'あなたが最も重視するのは？',
    options: [
      { value: 1, text: '論理的で合理的な判断' },
      { value: 2, text: '効率性と成果' },
      { value: 3, text: '公平性と正義' },
      { value: 4, text: '人間関係への配慮' },
      { value: 5, text: '調和と協力' },
    ],
    category: 'T-F',
  },
  {
    id: 5,
    question: '計画を立てる時のあなたは？',
    options: [
      { value: 1, text: '詳細なスケジュールを作成する' },
      { value: 2, text: '期限を決めて逆算する' },
      { value: 3, text: '大まかな流れだけ決める' },
      { value: 4, text: '状況に応じて柔軟に対応する' },
      { value: 5, text: '計画よりも直感を重視する' },
    ],
    category: 'J-P',
  },
  {
    id: 6,
    question: '週末の過ごし方として最も魅力的なのは？',
    options: [
      { value: 1, text: '友人たちとアクティブに過ごす' },
      { value: 2, text: 'イベントやパーティーに参加する' },
      { value: 3, text: '家族や親しい友人と時間を過ごす' },
      { value: 4, text: '一人で読書や映画鑑賞' },
      { value: 5, text: '静かな場所でリラックス' },
    ],
    category: 'E-I',
  },
  {
    id: 7,
    question: '新しい仕事を覚える時、あなたは？',
    options: [
      { value: 1, text: 'マニュアルを詳しく読む' },
      { value: 2, text: '実際にやってみながら覚える' },
      { value: 3, text: '先輩に質問しながら覚える' },
      { value: 4, text: '全体の流れを把握してから詳細に入る' },
      { value: 5, text: '自分なりの方法を見つける' },
    ],
    category: 'S-N',
  },
  {
    id: 8,
    question: '決断を下す時、最も影響するのは？',
    options: [
      { value: 1, text: '客観的な分析結果' },
      { value: 2, text: '論理的な推論' },
      { value: 3, text: 'データと事実' },
      { value: 4, text: '関係者の気持ち' },
      { value: 5, text: '感情的な直感' },
    ],
    category: 'T-F',
  },
  {
    id: 9,
    question: '旅行の計画を立てる時は？',
    options: [
      { value: 1, text: '詳細な行程表を作成する' },
      { value: 2, text: '主要な予定だけ決める' },
      { value: 3, text: 'ある程度の計画は立てる' },
      { value: 4, text: '現地で決めることが多い' },
      { value: 5, text: '完全に行き当たりばったり' },
    ],
    category: 'J-P',
  },
  {
    id: 10,
    question: 'ストレスを感じた時、どうやって解消しますか？',
    options: [
      { value: 1, text: '友人と話して発散する' },
      { value: 2, text: '外出してアクティブに過ごす' },
      { value: 3, text: '信頼できる人に相談する' },
      { value: 4, text: '一人の時間を作る' },
      { value: 5, text: '静かに内省する' },
    ],
    category: 'E-I',
  },
];

export default function PersonalityTestScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const progress = (currentQuestion / questions.length) * 100;

  const handleAnswerSelect = (value: number) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      Alert.alert('回答してください', '選択肢を選んでから次に進んでください');
      return;
    }

    const newAnswers = { ...answers, [questions[currentQuestion].id]: selectedOption };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      // プログレスバーのアニメーション
      Animated.timing(progressAnim, {
        toValue: ((currentQuestion + 1) / questions.length) * 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
      
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      // テスト完了
      calculateResult(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      // プログレスバーのアニメーション
      Animated.timing(progressAnim, {
        toValue: ((currentQuestion - 1) / questions.length) * 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
      
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[questions[currentQuestion - 1].id] || null);
    }
  };

  const calculateResult = (finalAnswers: { [key: number]: number }) => {
    // MBTIタイプ計算ロジック
    const scores = { 'E-I': 0, 'S-N': 0, 'T-F': 0, 'J-P': 0 };

    questions.forEach((q) => {
      const answer = finalAnswers[q.id];
      if (answer) {
        // 1-2は左側の傾向（E,S,T,J）、4-5は右側の傾向（I,N,F,P）
        if (answer <= 2) {
          scores[q.category] -= (3 - answer);
        } else if (answer >= 4) {
          scores[q.category] += (answer - 3);
        }
      }
    });

    const personalityType = 
      (scores['E-I'] < 0 ? 'E' : 'I') +
      (scores['S-N'] < 0 ? 'S' : 'N') +
      (scores['T-F'] < 0 ? 'T' : 'F') +
      (scores['J-P'] < 0 ? 'J' : 'P');

    Alert.alert(
      '診断結果',
      `あなたの性格タイプは ${personalityType} です！\n\n詳細な分析結果は後ほどマイページで確認できます。`,
      [{ text: 'OK', onPress: () => console.log('テスト完了') }]
    );
  };

  const currentQ = questions[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>性格診断テスト</Text>
        <Text style={styles.questionNumber}>
          質問 {currentQuestion + 1} / {questions.length}
        </Text>
        
        {/* プログレスバー */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQ.question}</Text>

          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => handleAnswerSelect(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentQuestion > 0 && (
          <TouchableOpacity style={styles.prevButton} onPress={handlePrevious}>
            <Text style={styles.buttonText}>戻る</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedOption === null && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedOption === null}
        >
          <Text style={styles.buttonText}>
            {currentQuestion === questions.length - 1 ? '結果を見る' : '次へ'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    paddingTop: 30,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3748',
    lineHeight: 28,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionButtonSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f7fafc',
  },
  optionText: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  prevButton: {
    flex: 1,
    backgroundColor: '#a0aec0',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#667eea',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#cbd5e0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 