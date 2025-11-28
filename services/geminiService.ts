import { GoogleGenAI, Type } from "@google/genai";
import { TechniqueRecommendation, OptimizationReport, AppliedTechnique } from '../types';
import { DetailLevel } from "../App";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const availableTechniques = [
  'Chain of Thought (CoT)',
  'Tree of Thought (ToT)',
  'Meta Prompt',
  'Few-Shot Learning',
  'Self Consistency',
  'Progressive Prompting',
  'Role Playing',
  'Analogical Reasoning',
  'Critique & Revise',
  'Socratic Method',
];

const availableFrameworks = [
  'CARE Framework (Context, Action, Result, Example)',
  '4R Basic Framework (Role, Request, Result, Reference)',
  '4R Advance Framework (Reframe, Reason, Refine, Reflect)',
];

const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
        techniques: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Một mảng chứa tên các kỹ thuật được đề xuất từ danh sách cho trước."
        },
        framework: {
            type: Type.STRING,
            description: "Tên của framework được đề xuất từ danh sách. Trả về null nếu không có framework nào phù hợp."
        }
    }
};

const optimizationSchema = {
    type: Type.OBJECT,
    properties: {
        analysis: {
            type: Type.OBJECT,
            properties: {
                purpose: { type: Type.STRING, description: "Mục đích chính của prompt gốc." },
                strengths: { type: Type.STRING, description: "Những điểm mạnh, điểm tốt của prompt gốc." },
                weaknesses: { type: Type.STRING, description: "Những điểm yếu, điểm cần cải thiện của prompt gốc." }
            },
            description: "Phân tích chi tiết về prompt gốc."
        },
        appliedTechniques: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Tên kỹ thuật/framework đã được áp dụng." },
                    reason: { type: Type.STRING, description: "Giải thích lý do tại sao kỹ thuật/framework này được chọn và nó cải thiện prompt như thế nào." }
                }
            },
            description: "Danh sách các kỹ thuật và framework đã áp dụng cùng với lý do."
        },
        optimizedPrompt: {
            type: Type.STRING,
            description: "Prompt cuối cùng đã được tối ưu hóa bằng tiếng Việt."
        },
        improvementsSummary: {
            type: Type.STRING,
            description: "Tóm tắt những cải thiện cụ thể đã thực hiện so với prompt gốc."
        }
    }
};

export const recommendTechniques = async (prompt: string): Promise<TechniqueRecommendation> => {
    const metaPrompt = `
        BẠN LÀ MỘT CHUYÊN GIA PROMPT ENGINEERING.
        Phân tích prompt sau đây và chọn ra các kỹ thuật và một framework phù hợp nhất để cải thiện nó.

        Prompt gốc: "${prompt}"

        Danh sách Kỹ thuật có sẵn:
        ${availableTechniques.join('\n')}

        Danh sách Framework có sẵn:
        ${availableFrameworks.join('\n')}

        Chỉ trả về một đối tượng JSON chứa hai khóa: "techniques" (một mảng các chuỗi) và "framework" (một chuỗi hoặc null). KHÔNG giải thích.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: metaPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recommendationSchema,
                temperature: 0.2,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Lỗi khi đề xuất kỹ thuật:", error);
        throw new Error("Không thể nhận đề xuất từ AI.");
    }
}

export const optimizePrompt = async (
    prompt: string, 
    techniques: string[], 
    framework: string | null,
    detailLevel: DetailLevel
): Promise<OptimizationReport> => {
    const detailInstruction = {
        short: "ngắn gọn, đi thẳng vào trọng tâm, súc tích nhất có thể.",
        medium: "cân bằng giữa chi tiết và sự ngắn gọn, cung cấp đủ ngữ cảnh cần thiết.",
        long: "cực kỳ chi tiết, giải thích từng bước, cung cấp nhiều ngữ cảnh và ví dụ nếu có thể."
    };
    
    const metaPrompt = `
        BẠN LÀ MỘT CHUYÊN GIA PROMPT ENGINEERING.
        Nhiệm vụ của bạn là thực hiện một phân tích toàn diện và tối ưu hóa prompt sau đây bằng tiếng Việt.

        Prompt gốc: 
        ---
        ${prompt}
        ---

        CÁC LỰA CHỌN TỪ NGƯỜI DÙNG:
        1.  **Mức độ chi tiết mong muốn:** ${detailInstruction[detailLevel]}
        2.  **Các kỹ thuật đã chọn:** ${techniques.length > 0 ? techniques.join(', ') : 'Không có kỹ thuật cụ thể nào được chọn.'}
        3.  **Framework cấu trúc đã chọn:** ${framework ? framework : 'Không có framework cụ thể nào được chọn.'}
        
        HÃY THỰC HIỆN CÁC BƯỚC SAU VÀ TRẢ VỀ KẾT QUẢ DƯỚI DẠNG MỘT ĐỐI TƯỢNG JSON DUY NHẤT:

        1.  **PHÂN TÍCH PROMPT GỐC (analysis):**
            *   **Mục đích (purpose):** Xác định mục tiêu chính mà người dùng muốn đạt được.
            *   **Điểm mạnh (strengths):** Nêu rõ những điểm tốt (nếu có) của prompt gốc.
            *   **Điểm yếu (weaknesses):** Chỉ ra những điểm chưa rõ ràng, mơ hồ, hoặc thiếu sót cần cải thiện.

        2.  **GIẢI THÍCH KỸ THUẬT ÁP DỤNG (appliedTechniques):**
            *   Tạo một mảng các đối tượng.
            *   Với mỗi kỹ thuật và framework được người dùng chọn (hoặc bạn tự đề xuất thêm nếu cần), hãy tạo một đối tượng.
            *   **Tên (name):** Ghi tên kỹ thuật/framework.
            *   **Lý do (reason):** Giải thích ngắn gọn tại sao kỹ thuật/framework này lại phù hợp và nó sẽ giúp cải thiện prompt gốc như thế nào (về logic, cấu trúc, độ rõ ràng, v.v.).

        3.  **TẠO PROMPT TỐI ƯU (optimizedPrompt):**
            *   Viết lại hoàn toàn prompt gốc.
            *   Áp dụng tất cả các kỹ thuật và framework đã chọn.
            *   Đảm bảo prompt mới tuân thủ mức độ chi tiết người dùng yêu cầu.
            *   Sử dụng ngôn từ rõ ràng, cụ thể, và cấu trúc logic.

        4.  **TÓM TẮT CẢI THIỆN (improvementsSummary):**
            *   Viết một đoạn tóm tắt ngắn gọn, gạch đầu dòng những điểm cải tiến chính của prompt mới so với prompt gốc.

        CHỈ TRẢ VỀ ĐỐI TƯỢNG JSON THEO ĐÚNG CẤU TRÚC ĐÃ MÔ TẢ. KHÔNG THÊM BẤT KỲ GIẢI THÍCH NÀO BÊN NGOÀI JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: metaPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: optimizationSchema,
                temperature: 0.5,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Lỗi khi tối ưu prompt:", error);
        throw new Error("Không thể tối ưu prompt từ AI.");
    }
};
