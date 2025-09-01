// Contact form handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const formStatus = document.getElementById('form-status');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        formStatus.classList.add('hidden');

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        try {
            // Get API Gateway endpoint from CDK output
            // This will be dynamically replaced after deployment
            const apiEndpoint = window.API_ENDPOINT || 'https://u32lgdq079.execute-api.eu-central-1.amazonaws.com/prod';
            
            const response = await fetch(`${apiEndpoint}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Success
                showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                // Error from server
                showStatus(result.error || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showStatus('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
        }
    });

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.classList.add('hidden');
        }, 5000);
    }

    // Terminal cursor animation
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }

    // Add retro typing effect to the terminal
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        const content = line.innerHTML;
        line.innerHTML = '';
        
        setTimeout(() => {
            typeText(line, content, 50);
        }, index * 1000);
    });

    function typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Show output after command is typed
                const nextOutput = element.nextElementSibling;
                if (nextOutput && nextOutput.classList.contains('output')) {
                    nextOutput.style.display = 'block';
                    nextOutput.style.opacity = '0';
                    setTimeout(() => {
                        nextOutput.style.opacity = '1';
                    }, 100);
                }
            }
        }, speed);
    }

    // Initially hide outputs for typing effect
    const outputs = document.querySelectorAll('.output');
    outputs.forEach(output => {
        output.style.display = 'none';
    });
});