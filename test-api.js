/**
 * OpenAI API集成测试脚本
 * 用于验证API配置是否正确工作
 */

const { OpenAIService } = require('./lib/openai-service.ts');

// 测试文本
const testTexts = [
  "今天是个好天气，阳光明媚，我们决定去公园散步。",
  "新的AI技术正在改变世界，它为各行各业带来了革命性的变化。"
];

// 测试风格
const testStyles = ['ap-style', 'x-style', 'academic'];

async function testOpenAIIntegration() {
  console.log('🧪 开始测试OpenAI API集成...\n');
  
  try {
    const service = new OpenAIService();
    
    for (const text of testTexts) {
      console.log(`📝 测试文本: "${text}"\n`);
      
      for (const style of testStyles) {
        console.log(`🎨 测试风格: ${style}`);
        
        try {
          const result = await service.transform(text, style);
          
          console.log('✅ 转换成功:');
          console.log(`⏱️ 处理时间: ${result.processingTime}ms`);
          console.log(`📄 转换结果: ${result.transformedText.substring(0, 100)}...`);
          console.log('');
          
        } catch (error) {
          console.error(`❌ 转换失败 (${style}):`, error.message);
          console.log('');
        }
      }
      
      console.log('---\n');
    }
    
    console.log('🎉 API集成测试完成!');
    
  } catch (error) {
    console.error('❌ 初始化OpenAI服务失败:', error.message);
    console.log('\n💡 请检查:');
    console.log('1. .env.local 文件是否存在');
    console.log('2. OPENAI_API_KEY 是否正确设置');
    console.log('3. API密钥是否有效');
  }
}

// 运行测试
if (require.main === module) {
  testOpenAIIntegration();
}

module.exports = { testOpenAIIntegration };
