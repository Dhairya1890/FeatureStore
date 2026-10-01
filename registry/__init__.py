"""
Feature Registry

- It is the source of truth for every feature in the system
- It defines a feature once
- It stores its metadata    
- It makes the feature discoverable
- It lets both training and serving code read the same definition
"""

# Feature Registration API

''' This is a user facing entry point'''

from dataclasses import dataclass
from typing import Callable

''' What is a dataclass - A Dataclass is a python module that makes it easy to write classes, it automatically handles the init and other class boilerplatting so we don't have to write them'''

''' A dataclass is just a class that holds data, It's python's clean way of defining a container for related fields'''

@dataclass
class FeatureRecord:
    name : str
    entity_type : str
    fn : Callable
    version : str
    owner : str
    ttl : int = 3600
    description : str = ""
    data_type : str = "float"
    '''The @property decorator is a built in feature that allows
    a class method to be accessed like a regular attribute, it provides a clean way to implement
    getters, setters, and deleters without forcing users of your class to call explicit methods like
    get_value() or set_value()
    '''
    @property
    def compute_fn(self):
        return self.fn

''' In Memory Store '''
'''
1. holds the live FeatureRecord, including the compute function
2. Used in the hot path : online reads, materialization loop, request validation
'''
_registry : dict[str, FeatureRecord] = {}

''' The decorator '''

def feature(entity : str, 
            ttl : int = 3600,
            description : str = "", 
            data_type : str = "float", 
            version : str = "0.0.1",
            owner : str = ' '
            ):

    def wrapper(fn):
        new_feature = FeatureRecord(fn.__name__, entity_type=entity, fn=fn, ttl=ttl, description=description, data_type=data_type, version=version, owner=owner)
        _registry[fn.__name__] = new_feature
        return fn
    return wrapper
'''gets the name of the feature'''
def get(name : str) -> FeatureRecord | None:
    return _registry.get(name)

def list_all() -> dict[str, FeatureRecord]:
    return _registry

