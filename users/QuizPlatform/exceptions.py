from rest_framework.views import exception_handler


def core_exception_handler(exc, context):
    """
    Handles exceptions and returns a response.

        This method intercepts exceptions, checks if a specific handler exists for the
        exception type, and applies that handler if available. Otherwise, it returns
        the default exception response.

        Args:
            exc: The exception object.
            context: The context in which the exception occurred.

        Returns:
            dict: The response to be returned, potentially modified by a specific error handler.
    """
    response = exception_handler(exc, context)
    handlers = {"ValidationError": _handle_generic_error}

    exception_class = exc.__class__.__name__

    if exception_class in handlers:
        return handlers[exception_class](exc, context, response)

    return response


def _handle_generic_error(exc, context, response):
    """
    Handles a generic exception by wrapping the existing response data in an 'errors' field.

        Args:
            exc: The exception that occurred.
            context:  Contextual information about the error (not used).
            response: The response object to modify.

        Returns:
            The modified response object with errors wrapped in an 'errors' field.
    """
    response.data = {"errors": response.data}

    return response
