Simply create a request with a custom HTTP method `SSE` 
or add the header `x-sse` with a truthy value, and it will 
trigger the plugin. 

**Note that the insomnia plugin API doesn't allow me to disable the initial request. 
You will receive a dummy request followed by the EventSource**

You can specify the event name in the `x-event-name` header.

![image](https://github.com/BinarSkugga/insomnia-plugin-skugga-sse/assets/7575628/8c818981-a48b-4dce-9e53-9d88e7525ab4)

![image](https://github.com/BinarSkugga/insomnia-plugin-skugga-sse/assets/7575628/246ff062-11dc-48b0-8800-6c12246babd3)
