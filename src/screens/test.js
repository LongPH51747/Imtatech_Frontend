const data = {
  identificationData: {
    access_token: 'hakouurCUL0hTqU',
    completed: 1751288338.524942,
    created: 1751288338.279762,
    custom_id: null,
    input: {
      datetime: '2025-06-30T12:58:58.279762+00:00',
      images: [Array],
      latitude: null,
      longitude: null,
      similar_images: true,
    },
    model_version: 'plant_id:5.0.0',
    result: {classification: [Object], is_plant: [Object]},
    sla_compliant_client: true,
    sla_compliant_system: true,
    status: 'COMPLETED',
  },
  message:
    "Chúng tôi không chắc chắn đây là cây gì. Kết quả có khả năng cao nhất là 'Desmos' nhưng độ chính xác quá thấp: 0.98%.",
};
const dataAsk = {
  feedback: {},
  identification: 'Deed098OoY5WcSh',
  messages: [
    {
      content: ' chăm sóc như nào',
      created: '2025-06-30T13:36:40.434Z',
      type: 'question',
    },
    {
      content:
        'Đối với cây thuộc chi Desmos, việc chăm sóc có thể được thực hiện theo các bước sau:' +
        '1. **Ánh sáng**: Desmos thích ánh sáng sáng nhưng không quá gay gắt. Bạn nên đặt cây ở nơi có ánh sáng gián tiếp hoặc ánh sáng mặt trời nhẹ.' +
        '2. **Đất**: Sử dụng đất thoát nước tốt. Một hỗn hợp đất trồng có chứa mùn, đất sét và cát sẽ giúp cây phát triển tốt hơn.' +
        '3. **Tưới nước**: Tưới nước đều đặn nhưng không để cây ngập úng. Đảm bảo đất khô nhẹ giữa các lần tưới.' +
        '4. **Nhiệt độ**: Cây Desmos thường phát triển tốt ở nhiệt độ ấm, từ 20-30 độ C. Tránh để cây tiếp xúc với nhiệt độ lạnh hoặc gió lùa.' +
        '5. **Bón phân**: Có thể bón phân hữu cơ hoặc phân bón hòa tan trong nước vào mùa sinh trưởng để cung cấp dinh dưỡng cho cây.' +
        '6. **Cắt tỉa**: Cắt tỉa các cành khô hoặc hư hỏng để duy trì hình dáng và sức khỏe của cây.' +
        'Đảm bảo theo dõi cây thường xuyên để phát hiện sớm các dấu hiệu của bệnh tật hoặc thiếu dinh dưỡng, mặc dù hiện tại không có đề xuất về bệnh tật cho cây Desmos.',
      created: '2025-06-30T13:36:40.434Z',
      type: 'answer',
    },
  ],
  model_parameters: {model: 'gpt-4o-mini', temperature: 0.5},
  remaining_calls: 19,
};
